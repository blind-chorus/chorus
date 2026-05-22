# Chorus

## Purpose

Chorus is a design system built to be **read by agents**. Specs, tokens, and components are published as a machine-readable contract so that AI agents can compose advanced, fully-styled prototypes directly from the system — no guesswork, no drift, no manual translation between intent and implementation.

Humans benefit from the same source of truth: one canonical spec drives the docs site, the React package, and every downstream renderer.

---

Monorepo entry point for the Chorus design system. Orientation only — system meaning lives in [`schema/DESIGN.md`](schema/DESIGN.md); per-package conventions live in each package README.

## Where things live

npm workspaces monorepo. Top-level groups:

- **[`schema/`](schema)** — source of truth. Machine-readable contract; never inferred from code.
  - [`schema/DESIGN.md`](schema/DESIGN.md) — canonical design document: principles, token roles, composition rules.
  - [`schema/manifest.json`](schema/manifest.json) — system inventory; the single entry point for agents and renderers.
  - [`schema/catalog.md`](schema/catalog.md) — intent → component routing layer.
  - [`schema/tokens`](schema/tokens) — reference + system token JSON and resolved per-theme bundles (`resolved.light.json`, `resolved.dark.json`, sparse `resolved.web.*.json`).
  - [`schema/components`](schema/components) — per-component anatomy specs. See [`schema/components/README.md`](schema/components/README.md) for the authoring contract.
  - [`schema/screens`](schema/screens) — pre-validated `*.screen.json` recipes. Prefer cloning a recipe over from-scratch composition.
  - [`schema/lint`](schema/lint) — schema + token validators (`validate-screen.mjs`, `validate-tokens.mjs`). Wired into `npm run lint`.
  - [`schema/icons`](schema/icons) — icon schema (planned).
- **[`packages/`](packages)** — source-distributed implementations.
  - [`packages/ui`](packages/ui) — `@blind-dsai/ui`: workspace-only React implementation of the schema. JSX emits inline `--<component>-*` vars consumed by `styles.css`. See AGENTS.md "Renderer guidance" for the two consumption paths.
- **[`apps/`](apps)** — consumers.
  - [`apps/docs`](apps/docs) — live documentation site. See [`apps/docs/README.md`](apps/docs/README.md) for build conventions and the source-of-truth rule.
  - [`apps/mcp-server`](apps/mcp-server) — MCP server exposing the schema to AI agents and design tools.
  - [`apps/visual-regression`](apps/visual-regression) — Playwright visual regression for the docs site.
- **[`CONSUMING.md`](CONSUMING.md)** — how external projects consume Chorus. Lovable users: overlay the [`lovable-export/`](lovable-export) snapshot into your Lovable-connected repo (see CONSUMING.md § Lovable).
- **[`patterns/`](patterns)** — canonical pixel references + per-screen notes (intent, tokens, components). Visual inspiration; specs/tokens still win on conflict.
- **[`claude-memory/`](claude-memory)** — durable, project-scoped memory accumulated across Claude Code agent sessions. Decisions, conventions, and *why-not* rationales that aren't derivable from the code. Read [`claude-memory/MEMORY.md`](claude-memory/MEMORY.md) as the index. AGENTS.md hard rules cite specific entries (e.g. `[memory: token pairs]`); agents picking up new work should scan the index for relevant feedback before improvising. Not loaded by external renderers — this is institutional knowledge for whoever (human or agent) edits the system.

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
