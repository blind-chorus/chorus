# Chorus

Monorepo entry point for the Chorus design system. Orientation only — system meaning lives in [`schema/DESIGN.md`](schema/DESIGN.md); per-package conventions live in each package README.

## Where things live

npm workspaces monorepo. Two top-level groups:

- **[`schema/`](schema)** — source of truth.
  - [`schema/DESIGN.md`](schema/DESIGN.md) — canonical design document: principles, token roles, composition rules.
  - [`schema/tokens`](schema/tokens) — reference and system token JSON (color, type, space, radius, elevation, state).
  - [`schema/components`](schema/components) — per-component anatomy specs. See [`schema/components/README.md`](schema/components/README.md) for the authoring contract.
  - [`schema/icons`](schema/icons) — icon schema (planned).
- **[`apps/`](apps)** — consumers.
  - [`apps/docs`](apps/docs) — live documentation site. See [`apps/docs/README.md`](apps/docs/README.md) for build conventions and the source-of-truth rule.
  - [`apps/mcp-server`](apps/mcp-server) — MCP server exposing the schema to AI agents and design tools.
  - [`apps/visual-regression`](apps/visual-regression) — Playwright visual regression for the docs site.

## Start here

- **System rationale** — [`schema/DESIGN.md`](schema/DESIGN.md). Token architecture, color/type/spacing/radius/elevation, anatomy index, brand adaptation.
- **Docs site** — [`apps/docs/README.md`](apps/docs/README.md). Token-first rule, IA mapping, source-of-truth contract, CSS conventions.
- **Authoring a spec** — [`schema/components/README.md`](schema/components/README.md). File layout, `# Title` rule, section pattern, end-to-end Badge walkthrough.
- **External tools, AI agents, downstream renderers** — [`AGENTS.md`](AGENTS.md). Read order, hard rules, composition contract. [`schema/manifest.json`](schema/manifest.json) is the system inventory — never crawl `schema/components/` to infer shape.

## Running locally

```bash
npm install
npm run dev
```
