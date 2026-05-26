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
//     chorus://compose         → /prompt/compose.md (composition cheatsheet)
//     chorus://anti-patterns   → /prompt/anti-patterns.md (wrong-vs-right pairs)
//     chorus://tokens/light    → /schema/tokens/resolved.light.json
//     chorus://tokens/dark     → /schema/tokens/resolved.dark.json
//     chorus://tokens/usage    → /schema/tokens/tokens.usage.json (per-token
//                                role + slot allowlist)
//
//   Tools (callable functions):
//     list_families            → enumerate every family + useCases
//     get_family(family)       → that family's family.json
//     get_spec(family, sub?)   → that sub-component's spec.json
//     get_bundle(family, sub?) → spec + related tokens.usage entries +
//                                screen recipes that use this family. The
//                                single safe-context query — replaces the
//                                3-step (spec → tokens → recipe) lookup.
//     list_screens             → enumerate every screen recipe
//     get_screen(slug)         → that recipe's screen.json
//     resolve_token(key,theme?)→ resolved value (e.g. sys.color.primary)
//     search_intent(query)     → families whose useCases match the query
//     validate_screen(recipe)  → run the screen validator on an arbitrary
//                                recipe object (in-memory; does not require
//                                the recipe to be saved to disk)
//     validate_layout_inset(recipe)
//                              → run the layoutInset validator on a recipe.
//                                Surfaces inline-at-page-level + bounded-
//                                surface hosting full-bleed warnings.
//     check_layout_inset(snippet)
//                              → heuristic scan of a JSX / HTML snippet for
//                                full-bleed Chorus components wrapped in a
//                                padding-inline parent (className="px-*",
//                                Tailwind p[xs]-N, style={{ padding… }}).
//                                Self-check hook for agents before they
//                                commit a compose step.
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
import {
  buildLayoutInsetMap,
  validateRecipe as validateLayoutInsetRecipe,
} from "../../../schema/lint/validate-layout-inset.mjs";
import { readJson } from "../../../schema/lint/utils.mjs";

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
  {
    uri: "chorus://tokens/usage",
    name: "tokens.usage.json",
    description:
      "Per-token role + usage index. One entry per agent-pickable sys.* token with `role`, `usedFor[]`, `notFor[]`, `pairsWith`, `allowedComponents[]`, `forbiddenComponents[]`, `maxInstancesPerScreen`. Replaces grepping DESIGN.md prose — single read per token.",
    mimeType: "application/json",
    path: join(SCHEMA_DIR, "tokens", "tokens.usage.json"),
  },
  {
    uri: "chorus://compose",
    name: "compose.md",
    description:
      "One-page composition cheatsheet — spacing recipes, color quartet picker, type ramp picker, per-slot typography table, 10 composition guard rails. Skim before composing any new surface.",
    mimeType: "text/markdown",
    path: join(REPO_ROOT, "prompt", "compose.md"),
  },
  {
    uri: "chorus://anti-patterns",
    name: "anti-patterns.md",
    description:
      "Catalogue of common Chorus-failure shapes with wrong-vs-right code snippet pairs. If your output matches a ❌ snippet, discard and regenerate.",
    mimeType: "text/markdown",
    path: join(REPO_ROOT, "prompt", "anti-patterns.md"),
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
    name: "get_bundle",
    description:
      "Return a composition-ready bundle for one sub-component: the spec.json, the family's family.json (for visualReuse + layoutInset), every tokens.usage entry referenced inside the spec, and every screen recipe that uses this family. The single safe-context query — replaces the 3-step (spec → tokens → recipe) lookup an agent would otherwise do before composing. Prefer this over get_spec when you're about to write JSX.",
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
  {
    name: "validate_layout_inset",
    description:
      "Run the layoutInset validator on a screen-recipe object. Catalog audit (every family declares layoutInset) + per-region warnings: inline atom at page level, bounded-surface hosting full-bleed nested binding without the negative-margin opt-out hint. Mirrors `npm run lint:layout-inset`. Use this before authoring a new screen.json to confirm region role / family pairing.",
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
  {
    name: "check_layout_inset",
    description:
      "Heuristic scan of a JSX / HTML snippet for layoutInset=full-bleed Chorus components (List, Feed, Section, NavigationBar, TabBar, Tabs, AvatarRail, SuggestionList, Banner, FeedAd, PostCarousel, ProfileCarousel) wrapped in a padding-inline parent — Tailwind `px-N` / `p-N`, inline `style={{ padding… }}`, `paddingInline:`, or `padding-inline:` CSS. Reports each hit with line number, the offending wrapper, and the wrapped Chorus component name. Self-check hook agents can call BEFORE committing a compose step — paste the JSX you are about to ship and discard / regenerate when any hit is reported.",
    inputSchema: {
      type: "object",
      properties: {
        snippet: {
          type: "string",
          description:
            "JSX or HTML source to scan. May include surrounding context; the scanner walks character-by-character looking for full-bleed component openings preceded by an opening parent tag with padding-inline.",
        },
      },
      required: ["snippet"],
      additionalProperties: false,
    },
  },
];

// ---- Tool implementations ---------------------------------------------

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

  get_bundle({ family, subcomponent }) {
    const manifest = loadManifest();
    const r = loadSpec(manifest, family, subcomponent);
    if (r.error) return asError(r.error);
    const familyEntry = loadFamily(manifest, family);
    const familyJson = familyEntry?.family ?? null;

    // Token-usage references — scan the spec recursively for sys.* paths
    // and resolve each against tokens.usage.json.
    const tokensUsage = readJson(
      join(SCHEMA_DIR, "tokens", "tokens.usage.json"),
    ).tokens;
    const tokenRefs = new Set();
    const TOKEN_RE = /\b(sys\.[a-zA-Z0-9.]+?)(?=[\s,;)"`*]|$)/g;
    const walk = (node) => {
      if (node == null) return;
      if (typeof node === "string") {
        for (const m of node.matchAll(TOKEN_RE)) tokenRefs.add(m[1]);
        return;
      }
      if (Array.isArray(node)) {
        for (const v of node) walk(v);
        return;
      }
      if (typeof node === "object") for (const v of Object.values(node)) walk(v);
    };
    walk(r.spec);
    const relatedTokenUsage = {};
    for (const tok of [...tokenRefs].sort()) {
      // Try the token verbatim, then strip trailing `.size`/`.weight`/...
      // sub-paths to find the parent typo rung.
      let entry = tokensUsage[tok];
      if (!entry) {
        const parent = tok.split(".").slice(0, 4).join(".");
        entry = tokensUsage[parent];
      }
      if (entry) relatedTokenUsage[tok] = entry;
    }

    // Recipes that mention this family — manifest.screens carries
    // { slug, root }; load each and check region.family.
    const relatedRecipes = [];
    for (const { slug, root } of manifest.screens ?? []) {
      const screen = readJson(join(SCHEMA_DIR, root));
      const usesFamily = Object.values(screen.regions ?? {}).some(
        (region) => region?.family === family,
      );
      if (usesFamily) {
        relatedRecipes.push({
          slug,
          name: screen.name,
          description: screen.description,
        });
      }
    }

    return asTextContent({
      family,
      subcomponent: r.spec.subcomponent ?? subcomponent ?? null,
      spec: r.spec,
      familyMeta: familyJson
        ? {
            visualReuse: familyJson.visualReuse,
            layoutInset: familyJson.layoutInset,
            useCases: familyJson.useCases,
          }
        : null,
      relatedTokenUsage,
      relatedRecipes,
      readNext: [
        "chorus://compose — composition cheatsheet (spacing recipes, color quartet, type ramp, guard rails)",
        "chorus://anti-patterns — wrong-vs-right snippet pairs",
      ],
    });
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

  validate_layout_inset({ recipe }) {
    if (!recipe || typeof recipe !== "object") {
      return asError("recipe must be an object");
    }
    const manifest = loadManifest();
    const { map, missing } = buildLayoutInsetMap(manifest);
    const { issues, warnings } = validateLayoutInsetRecipe(recipe, map);
    return asTextContent({
      slug: recipe.slug ?? "(unnamed)",
      ok: issues.length === 0,
      catalogMissingLayoutInset: missing,
      issueCount: issues.length,
      issues,
      warningCount: warnings.length,
      warnings,
    });
  },

  check_layout_inset({ snippet }) {
    if (typeof snippet !== "string" || snippet.length === 0) {
      return asError("snippet must be a non-empty string");
    }
    return asTextContent(scanSnippetForFullBleedWrappers(snippet));
  },
};

// ---- check_layout_inset helper ----------------------------------------
//
// Heuristic scanner. Walks the snippet character-by-character — when it
// hits the opening tag of a known full-bleed Chorus component, it scans
// BACKWARD through the surrounding text for the nearest enclosing opening
// element and checks whether that element carries any padding-inline
// signal: Tailwind `px-N` / `p-N` / `pl-N` / `pr-N`, a `style={{ … }}`
// block with `padding` / `paddingInline`, or raw CSS `padding-inline:` /
// `padding-left:` / `padding-right:` in an inline style attribute. Hits
// outside opening JSX tags (text content, comments, string literals) are
// ignored by a simple bracket-depth heuristic.

const FULL_BLEED_COMPONENT_NAMES = [
  "List",
  "Feed",
  "FeedAd",
  "FeedGroup",
  "Section",
  "NavigationBar",
  "TabBar",
  "Tabs",
  "AvatarRail",
  "SuggestionList",
  "Banner",
  "PostCarousel",
  "ProfileCarousel",
];

const FULL_BLEED_RE = new RegExp(
  `<(${FULL_BLEED_COMPONENT_NAMES.join("|")})\\b`,
  "g",
);

const PARENT_PADDING_SIGNALS = [
  // Tailwind utility classes — px-N, p-N (any non-zero), pl-N, pr-N, ps-N, pe-N.
  // Match within a className="…" or className={'…'} attribute.
  {
    re: /class(?:Name)?=["'`][^"'`]*\bp[xlrse]?-(?!0\b)\d/i,
    label: "Tailwind padding utility",
  },
  // Inline JSX style object with padding / paddingInline / paddingLeft / paddingRight.
  {
    re: /style=\{\{[^}]*\bpadding(?:Inline(?:Start|End)?|Left|Right)?\s*:/i,
    label: "inline style={{ padding… }}",
  },
  // Raw CSS in an inline style="" attribute (HTML form).
  {
    re: /style=["'][^"']*\bpadding(?:-inline(?:-start|-end)?|-left|-right)?\s*:[^0]/i,
    label: "inline style=\"padding…\"",
  },
];

function lineOf(snippet, index) {
  let line = 1;
  for (let i = 0; i < index && i < snippet.length; i++) {
    if (snippet[i] === "\n") line += 1;
  }
  return line;
}

// Tokenize all JSX/HTML tags in the snippet into an array of
// { kind: 'open'|'close'|'self', name, start, end, text } records, in
// source order. Brace-aware so `style={{ … }}` does not confuse `>`.
function tokenizeTags(snippet) {
  const tokens = [];
  for (let i = 0; i < snippet.length; i++) {
    if (snippet[i] !== "<") continue;
    const isCloser = snippet[i + 1] === "/";
    // Find name
    let nameStart = isCloser ? i + 2 : i + 1;
    let nameEnd = nameStart;
    const nameRe = /[A-Za-z][A-Za-z0-9_:.-]*/y;
    nameRe.lastIndex = nameStart;
    const nameMatch = nameRe.exec(snippet);
    if (!nameMatch || nameMatch.index !== nameStart) continue;
    nameEnd = nameStart + nameMatch[0].length;
    const name = nameMatch[0];
    // Find tag close `>`, brace-aware
    let braceDepth = 0;
    let close = -1;
    for (let j = nameEnd; j < snippet.length; j++) {
      const c = snippet[j];
      if (c === "{") braceDepth += 1;
      else if (c === "}") braceDepth -= 1;
      else if (c === ">" && braceDepth === 0) {
        close = j;
        break;
      }
    }
    if (close === -1) continue;
    const isSelfClosing = snippet[close - 1] === "/";
    tokens.push({
      kind: isCloser ? "close" : isSelfClosing ? "self" : "open",
      name,
      start: i,
      end: close,
      text: snippet.slice(i, close + 1),
    });
    i = close;
  }
  return tokens;
}

// Ancestor stack of opening tags enclosing `atIndex`. Walks the token list
// forward maintaining a stack — push on `open`, pop on `close` matching by
// name. The stack at the moment we cross `atIndex` is the ancestor chain,
// outermost first.
function ancestorsAt(tokens, atIndex) {
  const stack = [];
  for (const t of tokens) {
    if (t.start >= atIndex) break;
    if (t.kind === "open") stack.push(t);
    else if (t.kind === "close") {
      // Pop the most recent open with matching name.
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name === t.name) {
          stack.splice(i, 1);
          break;
        }
      }
    }
    // self-closing tags do not affect the stack.
  }
  return stack;
}

function scanSnippetForFullBleedWrappers(snippet) {
  const hits = [];
  const tokens = tokenizeTags(snippet);
  for (const match of snippet.matchAll(FULL_BLEED_RE)) {
    const componentName = match[1];
    const idx = match.index ?? 0;
    const ancestors = ancestorsAt(tokens, idx);
    if (ancestors.length === 0) continue;
    const parent = ancestors[ancestors.length - 1];
    const offending = PARENT_PADDING_SIGNALS.find((s) => s.re.test(parent.text));
    if (!offending) continue;
    // The page shell IS supposed to pay the gutter once. Only flag this
    // padding-inline parent when it is itself nested inside another opening
    // tag (i.e. it is a wrapper, not the outermost shell).
    if (ancestors.length < 2) continue;
    hits.push({
      component: componentName,
      line: lineOf(snippet, idx),
      signal: offending.label,
      parentTag: parent.text.length > 160 ? parent.text.slice(0, 160) + "…" : parent.text,
      ancestorDepth: ancestors.length,
      remediation:
        `<${componentName}> is layoutInset="full-bleed" — must be a direct child of the page shell (or any surface that pays the gutter), no padding-inline wrapper. ` +
        "Either remove the parent's padding-inline (the page shell pays the gutter once at <main>), or — if the parent is a bounded surface (Card / Dialog / BottomSheet / Sheet) — apply the negative-margin opt-out: " +
        "marginInline: 'calc(-1 * var(--sys-layout-container-md))', width: 'calc(100% + 2 * var(--sys-layout-container-md))', maxWidth: 'none'. See LOVABLE.md §A.4 + AGENTS.md § Composition rules.",
    });
  }
  return {
    ok: hits.length === 0,
    hitCount: hits.length,
    hits,
    scannedComponents: FULL_BLEED_COMPONENT_NAMES,
    note:
      "Heuristic: flags padding-inline wrappers around full-bleed components when that wrapper is nested inside another opening tag in the snippet (i.e. it is not the outermost element / page shell). The outermost wrapper is treated as the page shell and exempted, since the shell is supposed to pay the gutter once. Snippets that contain only the inner composition (no shell) cannot be distinguished from a shell — include the page shell wrapper for accurate results.",
  };
}

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
