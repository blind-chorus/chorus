# @blind-dsai/mcp-server

Model Context Protocol server exposing the Chorus design system to AI agents — Claude Desktop, Cursor, Claude Code, Lovable, and any other client that speaks MCP.

## What this server gives an agent

**Resources** (read-only documents the agent fetches as context):

| URI | Path |
| --- | --- |
| `chorus://agents` | [`AGENTS.md`](../../AGENTS.md) — read first |
| `chorus://manifest` | [`schema/manifest.json`](../../schema/manifest.json) |
| `chorus://catalog` | [`schema/catalog.md`](../../schema/catalog.md) — intent → family map |
| `chorus://design` | [`schema/DESIGN.md`](../../schema/DESIGN.md) |
| `chorus://tokens/light` | [`schema/tokens/resolved.light.json`](../../schema/tokens/resolved.light.json) |
| `chorus://tokens/dark` | [`schema/tokens/resolved.dark.json`](../../schema/tokens/resolved.dark.json) |

**Tools** (callable functions):

| Tool | What it does |
| ---- | ------------ |
| `list_families` | Enumerate every family + sub-components + useCases |
| `get_family(family)` | Return the family.json |
| `get_spec(family, subcomponent?)` | Return the sub-component's spec.json |
| `list_screens` | Enumerate every pre-validated screen recipe |
| `get_screen(slug)` | Return the recipe |
| `resolve_token(key, theme?)` | Look up a token's resolved `{ $value, $type }` |
| `search_intent(query)` | Rank families by useCase / name / description match |
| `validate_screen(recipe)` | Run the screen validator on an in-memory recipe |

## Running

```bash
npm --workspace @blind-dsai/mcp-server run start    # stdio loop
npm --workspace @blind-dsai/mcp-server run smoke    # subprocess smoke test
```

There are no npm dependencies — the server speaks the MCP wire format (newline-delimited JSON-RPC 2.0 over stdio) directly. If you later add the official `@modelcontextprotocol/sdk` for type-safe sugar, the existing handler functions port over unchanged.

## Wiring into a client

**Claude Desktop** — add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "chorus": {
      "command": "node",
      "args": ["/absolute/path/to/chorus/apps/mcp-server/src/server.mjs"]
    }
  }
}
```

**Cursor** / **Claude Code** — same shape via each client's MCP config. Use an absolute path; the server resolves the repo root relative to its own file location.

**Custom client** — speak JSON-RPC 2.0 on stdin/stdout, newline-delimited. See [`test/smoke.mjs`](test/smoke.mjs) for a minimal client implementation.

## Adding a tool

Tools live in [`src/server.mjs`](src/server.mjs):

1. Add a definition object to `TOOLS` (name, description, JSON-schema `inputSchema`).
2. Add a handler to `toolHandlers` that returns `asTextContent(value)` or `asError(message)`.
3. Add a smoke-test case in `test/smoke.mjs` and run `npm run smoke`.
