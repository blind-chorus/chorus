#!/usr/bin/env node
// Smoke test: spawn the MCP server, exchange the standard handshake plus a
// round of tool / resource calls, assert each response shape. Run with
// `node apps/mcp-server/test/smoke.mjs`.
//
// This is a real subprocess test — it validates the stdio wire format,
// not just the in-process handlers.

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const SELF = fileURLToPath(import.meta.url);
const SERVER = resolve(dirname(SELF), "..", "src", "server.mjs");

class Client {
  constructor() {
    this.child = spawn("node", [SERVER], { stdio: ["pipe", "pipe", "pipe"] });
    this.buffer = "";
    this.pending = new Map();
    this.nextId = 1;
    this.child.stdout.on("data", (chunk) => {
      this.buffer += chunk.toString();
      let idx;
      while ((idx = this.buffer.indexOf("\n")) !== -1) {
        const line = this.buffer.slice(0, idx).trim();
        this.buffer = this.buffer.slice(idx + 1);
        if (!line) continue;
        let msg;
        try { msg = JSON.parse(line); } catch { continue; }
        const p = this.pending.get(msg.id);
        if (p) {
          this.pending.delete(msg.id);
          p.resolve(msg);
        }
      }
    });
    this.child.stderr.on("data", (chunk) => {
      // Echo server logs prefixed for easy spotting.
      process.stderr.write(`[server] ${chunk}`);
    });
  }
  call(method, params) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.child.stdin.write(
        JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n",
      );
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`timeout: ${method}`));
        }
      }, 5000);
    });
  }
  notify(method, params) {
    this.child.stdin.write(
      JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n",
    );
  }
  close() {
    this.child.stdin.end();
  }
}

const c = new Client();
let failures = 0;

function check(label, ok, extra = "") {
  if (ok) {
    console.log(`✓ ${label}`);
  } else {
    console.log(`✗ ${label}${extra ? ` — ${extra}` : ""}`);
    failures += 1;
  }
}

try {
  // Handshake
  const initRes = await c.call("initialize", { protocolVersion: "2024-11-05", clientInfo: { name: "smoke", version: "0" }, capabilities: {} });
  check(
    "initialize",
    initRes.result?.serverInfo?.name === "chorus-design-system" &&
      initRes.result?.capabilities?.tools !== undefined,
  );
  c.notify("notifications/initialized");

  // tools/list
  const toolsRes = await c.call("tools/list");
  const toolNames = (toolsRes.result?.tools ?? []).map((t) => t.name);
  check(
    "tools/list returns expected catalog",
    [
      "list_families",
      "get_family",
      "get_spec",
      "list_screens",
      "get_screen",
      "resolve_token",
      "search_intent",
      "validate_screen",
    ].every((n) => toolNames.includes(n)),
    `got [${toolNames.join(", ")}]`,
  );

  // resources/list
  const resRes = await c.call("resources/list");
  const uris = (resRes.result?.resources ?? []).map((r) => r.uri);
  check(
    "resources/list includes agents+manifest+tokens",
    [
      "chorus://agents",
      "chorus://manifest",
      "chorus://catalog",
      "chorus://tokens/light",
      "chorus://tokens/dark",
    ].every((u) => uris.includes(u)),
  );

  // resources/read manifest
  const readRes = await c.call("resources/read", { uri: "chorus://manifest" });
  const text = readRes.result?.contents?.[0]?.text ?? "";
  check(
    "resources/read manifest returns JSON containing components[]",
    text.includes("\"components\":") && text.includes("\"family\": \"button\""),
  );

  // list_families
  const listFams = await c.call("tools/call", { name: "list_families", arguments: {} });
  const fams = JSON.parse(listFams.result?.content?.[0]?.text ?? "[]");
  check(
    "list_families returns every manifest family with useCases",
    fams.length >= 14 && fams.every((f) => Array.isArray(f.useCases)),
    `got ${fams.length}`,
  );

  // get_spec(button, standard)
  const spec = await c.call("tools/call", {
    name: "get_spec",
    arguments: { family: "button", subcomponent: "standard" },
  });
  const specJson = JSON.parse(spec.result?.content?.[0]?.text ?? "{}");
  check(
    "get_spec(button/standard) carries appearances + states",
    specJson.appearances?.primary != null && specJson.states != null,
  );

  // get_spec with unknown sub
  const bad = await c.call("tools/call", {
    name: "get_spec",
    arguments: { family: "button", subcomponent: "not-a-sub" },
  });
  check(
    "get_spec(unknown sub) returns isError",
    bad.result?.isError === true,
  );

  // resolve_token
  const tok = await c.call("tools/call", {
    name: "resolve_token",
    arguments: { key: "sys.color.primary", theme: "dark" },
  });
  const tokJson = JSON.parse(tok.result?.content?.[0]?.text ?? "{}");
  check(
    "resolve_token(sys.color.primary, dark) returns hex",
    tokJson.theme === "dark" && /^#/.test(tokJson.$value ?? ""),
  );

  // search_intent
  const intent = await c.call("tools/call", {
    name: "search_intent",
    arguments: { query: "confirmation" },
  });
  const intentJson = JSON.parse(intent.result?.content?.[0]?.text ?? "{}");
  const matched = (intentJson.results ?? []).map((r) => r.family);
  check(
    "search_intent('confirmation') ranks dialog + bottom-sheet",
    matched.includes("dialog") && matched.includes("bottom-sheet"),
    `got [${matched.join(", ")}]`,
  );

  // list_screens
  const screens = await c.call("tools/call", { name: "list_screens", arguments: {} });
  const screensList = JSON.parse(screens.result?.content?.[0]?.text ?? "[]");
  check(
    "list_screens returns the pattern-paired recipes",
    screensList.map((s) => s.slug).sort().join(",") ===
      "compose,compose-channel,compose-kr,compose-kr-promotion,compose-offereval,main-company,main-explore,main-home,main-jobs,main-notifications,post,post-comments,search,settings",
  );

  // validate_screen — known-good
  const goodRecipe = {
    slug: "smoke-good",
    name: "Good",
    description: "smoke",
    regions: {
      top: { family: "navigation-bar", subcomponent: "page", props: { title: "Hello" } },
      body: { family: "list", props: { variant: "text" }, items: [{ value: "a", label: "A" }] },
    },
  };
  const good = await c.call("tools/call", {
    name: "validate_screen",
    arguments: { recipe: goodRecipe },
  });
  const goodJson = JSON.parse(good.result?.content?.[0]?.text ?? "{}");
  check("validate_screen(good) → ok:true", goodJson.ok === true, JSON.stringify(goodJson.issues));

  // validate_screen — two nav bars (should fail)
  const badRecipe = {
    slug: "smoke-bad",
    name: "Bad",
    description: "two navs",
    regions: {
      top: { family: "navigation-bar", subcomponent: "home", props: { title: "A" } },
      body: { family: "navigation-bar", subcomponent: "page", props: { title: "B" } },
    },
  };
  const badV = await c.call("tools/call", {
    name: "validate_screen",
    arguments: { recipe: badRecipe },
  });
  const badJson = JSON.parse(badV.result?.content?.[0]?.text ?? "{}");
  check(
    "validate_screen(two navs) → ok:false with screen-rule issue",
    badJson.ok === false && badJson.issues.some((i) => i.includes("navigation-bars")),
  );

  // Unknown method
  const bogus = await c.call("nonexistent/method", {});
  check("unknown method returns JSON-RPC error", bogus.error?.code === -32601);

} finally {
  c.close();
}

if (failures > 0) {
  console.log(`\n${failures} smoke test failure(s)`);
  process.exit(1);
}
console.log("\nAll smoke tests passed");
