#!/usr/bin/env node
// Chorus design-system MCP server — exposes the schema to any MCP client
// (Claude Desktop, Cursor, Claude Code, Lovable, …) over stdio.
//
// Wire protocol: JSON-RPC 2.0, newline-delimited, on stdin / stdout. Logs
// go to stderr so they never collide with the JSON-RPC channel.
//
// What this server reveals to an agent:
//
//   Resources (read-only documents):
//     chorus://agents          → /AGENTS.md (the agent contract)
//     chorus://design          → /schema/DESIGN.md
//     chorus://manifest        → /schema/manifest.json
//     chorus://catalog         → /schema/catalog.md
//     chorus://tokens/light    → /schema/tokens/resolved.light.json
//     chorus://tokens/dark     → /schema/tokens/resolved.dark.json
//
//   Tools (callable functions):
//     list_families            → enumerate every family + useCases
//     get_family(family)       → that family's family.json
//     get_spec(family, sub?)   → that sub-component's spec.json
//     list_screens             → enumerate every screen recipe
//     get_screen(slug)         → that recipe's screen.json
//     resolve_token(key,theme?)→ resolved value (e.g. sys.color.primary)
//     search_intent(query)     → families whose useCases match the query
//     validate_screen(recipe)  → run the screen validator on an arbitrary
//                                recipe object (in-memory; does not require
//                                the recipe to be saved to disk)
//
// Run via stdio:
//     node apps/mcp-server/src/server.mjs
// Or register with a client (Claude Desktop config example):
//     "chorus": { "command": "node", "args": ["<repo>/apps/mcp-server/src/server.mjs"] }

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline";

import {
  loadManifest,
  loadFamily,
  loadSpec,
  validateRecipe,
} from "../../../schema/lint/validate-screen.mjs";

const SELF = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(SELF), "..", "..", "..");
const SCHEMA_DIR = join(REPO_ROOT, "schema");

const PROTOCOL_VERSION = "2024-11-05";
const SERVER_INFO = {
  name: "chorus-design-system",
  version: "0.0.0",
};

// ---- Resource catalog --------------------------------------------------

const RESOURCES = [
  {
    uri: "chorus://agents",
    name: "AGENTS.md",
    description:
      "Read this first. The agent contract: read order, hard rules, composition workflow, validator inventory.",
    mimeType: "text/markdown",
    path: join(REPO_ROOT, "AGENTS.md"),
  },
  {
    uri: "chorus://manifest",
    name: "manifest.json",
    description:
      "Single entry point. Lists every family, every sub-component, every screen recipe, the resolved-token bundles, and the JSON Schemas.",
    mimeType: "application/json",
    path: join(SCHEMA_DIR, "manifest.json"),
  },
  {
    uri: "chorus://catalog",
    name: "catalog.md",
    description:
      "Intent → family map. Use BEFORE opening any spec: routes natural-language requests to candidate families.",
    mimeType: "text/markdown",
    path: join(SCHEMA_DIR, "catalog.md"),
  },
  {
    uri: "chorus://design",
    name: "DESIGN.md",
    description:
      "Cross-cutting design rules every spec defers to: color quartets, focus ring composition, no-layout strokes, state overlays.",
    mimeType: "text/markdown",
    path: join(SCHEMA_DIR, "DESIGN.md"),
  },
  {
    uri: "chorus://tokens/light",
    name: "resolved.light.json",
    description:
      "Flat path → { $value, $type } map of every token in light theme. Use this for rendering.",
    mimeType: "application/json",
    path: join(SCHEMA_DIR, "tokens", "resolved.light.json"),
  },
  {
    uri: "chorus://tokens/dark",
    name: "resolved.dark.json",
    description:
      "Flat path → { $value, $type } map of every token in dark theme. Use this for rendering.",
    mimeType: "application/json",
    path: join(SCHEMA_DIR, "tokens", "resolved.dark.json"),
  },
];

// ---- Tool catalog ------------------------------------------------------

const TOOLS = [
  {
    name: "list_families",
    description:
      "List every component family in the system with its name, description, sub-components, and useCases (intent keywords).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_family",
    description:
      "Return the family.json for one family slug (e.g. 'button'). Includes axes, sub-components, useCases.",
    inputSchema: {
      type: "object",
      properties: {
        family: { type: "string", description: "kebab-case family slug" },
      },
      required: ["family"],
      additionalProperties: false,
    },
  },
  {
    name: "get_spec",
    description:
      "Return the .spec.json for one sub-component. Omit `subcomponent` to get the family's default. Includes props, slots, sizes, appearances, states, behavior.",
    inputSchema: {
      type: "object",
      properties: {
        family: { type: "string", description: "kebab-case family slug" },
        subcomponent: {
          type: "string",
          description: "kebab-case sub-component slug; omit for default",
        },
      },
      required: ["family"],
      additionalProperties: false,
    },
  },
  {
    name: "list_screens",
    description:
      "List every screen recipe in the system with slug, name, description, and useCases. Recipes are pre-validated compositions — prefer cloning a recipe over from-scratch synthesis.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_screen",
    description:
      "Return the screen recipe JSON for one slug. Contains regions (top/body/bottom/fab/overlay), rules, and swappable family lists.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "kebab-case screen slug" },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "resolve_token",
    description:
      "Resolve a single token key (e.g. 'sys.color.primary', 'sys.layout.container.md') to its { $value, $type } in the requested theme. Theme defaults to 'light'.",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Dot-notated token path" },
        theme: { type: "string", enum: ["light", "dark"], default: "light" },
      },
      required: ["key"],
      additionalProperties: false,
    },
  },
  {
    name: "search_intent",
    description:
      "Search families by intent. Matches the query against each family.json's `useCases` array and the family name/description. Returns ranked candidates.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-form intent string" },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "validate_screen",
    description:
      "Validate an arbitrary screen-recipe object against the system contract. Runs the same checks as `npm run lint:screens` (slot fill, accepts compatibility, screen-level rules) without requiring the recipe to be saved to disk.",
    inputSchema: {
      type: "object",
      properties: {
        recipe: {
          type: "object",
          description:
            "Screen recipe in the shape of schema/screens/screen.schema.json. Minimally: { slug, name, description, regions }.",
        },
      },
      required: ["recipe"],
      additionalProperties: false,
    },
  },
];

// ---- Tool implementations ---------------------------------------------

function readJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

function asTextContent(value) {
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return { content: [{ type: "text", text }] };
}

function asError(message) {
  return { content: [{ type: "text", text: message }], isError: true };
}

const toolHandlers = {
  list_families() {
    const manifest = loadManifest();
    const out = manifest.components.map(({ family, root }) => {
      const j = readJson(join(SCHEMA_DIR, root));
      return {
        family: j.family,
        name: j.name,
        description: j.description,
        useCases: j.useCases ?? [],
        subcomponents: (j.subcomponents ?? []).map((s) => ({
          slug: s.slug,
          default: !!s.default,
        })),
      };
    });
    return asTextContent(out);
  },

  get_family({ family }) {
    const manifest = loadManifest();
    const f = loadFamily(manifest, family);
    if (!f) return asError(`Unknown family: ${family}`);
    return asTextContent(f.family);
  },

  get_spec({ family, subcomponent }) {
    const manifest = loadManifest();
    const r = loadSpec(manifest, family, subcomponent);
    if (r.error) return asError(r.error);
    return asTextContent(r.spec);
  },

  list_screens() {
    const manifest = loadManifest();
    const out = (manifest.screens ?? []).map(({ slug, root }) => {
      const j = readJson(join(SCHEMA_DIR, root));
      return {
        slug: j.slug,
        name: j.name,
        description: j.description,
        useCases: j.useCases ?? [],
        regions: Object.keys(j.regions ?? {}),
      };
    });
    return asTextContent(out);
  },

  get_screen({ slug }) {
    const manifest = loadManifest();
    const entry = (manifest.screens ?? []).find((s) => s.slug === slug);
    if (!entry) return asError(`Unknown screen: ${slug}`);
    return asTextContent(readJson(join(SCHEMA_DIR, entry.root)));
  },

  resolve_token({ key, theme = "light" }) {
    const bundle = readJson(
      join(SCHEMA_DIR, "tokens", `resolved.${theme}.json`),
    );
    const hit = bundle[key];
    if (!hit) return asError(`Token not found in resolved.${theme}: ${key}`);
    return asTextContent({ key, theme, ...hit });
  },

  search_intent({ query }) {
    const q = query.toLowerCase().trim();
    if (!q) return asError("query is empty");
    const manifest = loadManifest();
    const results = [];
    for (const { family, root } of manifest.components) {
      const j = readJson(join(SCHEMA_DIR, root));
      let score = 0;
      const hits = [];
      for (const uc of j.useCases ?? []) {
        if (uc.toLowerCase().includes(q)) {
          score += 3;
          hits.push(`useCase:${uc}`);
        }
      }
      if (j.name.toLowerCase().includes(q)) {
        score += 2;
        hits.push("name");
      }
      if (j.description.toLowerCase().includes(q)) {
        score += 1;
        hits.push("description");
      }
      if (score > 0) {
        results.push({ family, name: j.name, score, matchedOn: hits });
      }
    }
    results.sort((a, b) => b.score - a.score);
    return asTextContent({ query, results });
  },

  validate_screen({ recipe }) {
    if (!recipe || typeof recipe !== "object") {
      return asError("recipe must be an object");
    }
    const manifest = loadManifest();
    const issues = validateRecipe(manifest, recipe);
    return asTextContent({
      slug: recipe.slug ?? "(unnamed)",
      ok: issues.length === 0,
      issueCount: issues.length,
      issues,
    });
  },
};

// ---- Resource handler --------------------------------------------------

function readResource(uri) {
  const r = RESOURCES.find((x) => x.uri === uri);
  if (!r) throw new Error(`Unknown resource: ${uri}`);
  const text = readFileSync(r.path, "utf8");
  return {
    contents: [{ uri, mimeType: r.mimeType, text }],
  };
}

// ---- JSON-RPC plumbing -------------------------------------------------

function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}

function ok(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function fail(id, code, message, data) {
  send({ jsonrpc: "2.0", id, error: { code, message, ...(data ? { data } : {}) } });
}

function handle(message) {
  const { id, method, params } = message;

  // Notifications (no `id`) have no response.
  const respondable = id !== undefined && id !== null;

  try {
    switch (method) {
      case "initialize": {
        if (!respondable) return;
        ok(id, {
          protocolVersion: PROTOCOL_VERSION,
          serverInfo: SERVER_INFO,
          capabilities: {
            tools: { listChanged: false },
            resources: { listChanged: false, subscribe: false },
          },
        });
        return;
      }
      case "notifications/initialized":
      case "initialized":
        return;
      case "ping": {
        if (respondable) ok(id, {});
        return;
      }
      case "tools/list": {
        if (respondable) ok(id, { tools: TOOLS });
        return;
      }
      case "tools/call": {
        const { name, arguments: args = {} } = params ?? {};
        const handler = toolHandlers[name];
        if (!handler) {
          if (respondable) fail(id, -32601, `Unknown tool: ${name}`);
          return;
        }
        const result = handler(args);
        if (respondable) ok(id, result);
        return;
      }
      case "resources/list": {
        if (respondable) {
          ok(id, {
            resources: RESOURCES.map(({ path, ...rest }) => rest),
          });
        }
        return;
      }
      case "resources/read": {
        const { uri } = params ?? {};
        if (respondable) ok(id, readResource(uri));
        return;
      }
      default: {
        if (respondable) fail(id, -32601, `Method not found: ${method}`);
      }
    }
  } catch (err) {
    process.stderr.write(`[chorus-mcp] ${err.stack ?? err.message}\n`);
    if (respondable) fail(id, -32603, err.message ?? String(err));
  }
}

// ---- stdio loop --------------------------------------------------------

function main() {
  process.stderr.write(
    `[chorus-mcp] ready — protocol ${PROTOCOL_VERSION}, ${TOOLS.length} tools, ${RESOURCES.length} resources\n`,
  );
  const rl = createInterface({ input: process.stdin, terminal: false });
  rl.on("line", (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let msg;
    try {
      msg = JSON.parse(trimmed);
    } catch (e) {
      process.stderr.write(`[chorus-mcp] non-JSON line ignored: ${trimmed.slice(0, 80)}\n`);
      return;
    }
    handle(msg);
  });
  rl.on("close", () => process.exit(0));
}

main();
