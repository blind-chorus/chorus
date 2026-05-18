# Chorus

> The monorepo entry point for the Chorus design system.

**Chorus** is the design system behind our product. This README is a thin orientation to the repo — what lives where, where to read next, how to run things locally. The system's *meaning* (why it looks the way it does, what each token role is for, how components compose) lives in [`schema/DESIGN.md`](schema/DESIGN.md); per-package conventions live in each package's README. This file does not restate any of that.

## Where things live

This repo is an npm workspaces monorepo. Two top-level groups:

- **[`schema/`](schema)** — the system's source of truth, consumed by everything else.
  - [`schema/DESIGN.md`](schema/DESIGN.md) — the canonical design document; every principle, token role, and composition rule.
  - [`schema/tokens`](schema/tokens) — reference and system token JSON (color, type, space, radius, elevation, state).
  - [`schema/components`](schema/components) — per-component anatomy specs (one folder per component, each with a single `.md`). See [`schema/components/README.md`](schema/components/README.md) for the authoring contract.
  - [`schema/icons`](schema/icons) — icon schema (planned).
- **[`apps/`](apps)** — surfaces that consume the schema.
  - [`apps/docs`](apps/docs) — the live documentation site (the most visible artifact of this repo). See [`apps/docs/README.md`](apps/docs/README.md) for build conventions and the source-of-truth rule that keeps the site from authoring its own prose.
  - [`apps/figma-plugin`](apps/figma-plugin) — Figma plugin (planned).

## Start here

- **Why Chorus looks the way it does** — [`schema/DESIGN.md`](schema/DESIGN.md). Token architecture, color/type/spacing/radius/elevation rationale, component anatomy index, how to adapt the system to a new brand.
- **Building the docs site** — [`apps/docs/README.md`](apps/docs/README.md). Token-first rule, IA mapping, source-of-truth contract, CSS conventions.
- **Authoring a component spec** — [`schema/components/README.md`](schema/components/README.md). File layout, the `# Title` → page-header rule, section pattern, and the end-to-end "Building Badge from scratch" walkthrough that shows every file an implementer touches.
- **External tools, AI agents, downstream renderers** — start at [`AGENTS.md`](AGENTS.md). It defines the read order (manifest → catalog → screens → specs → tokens → DESIGN.md), the hard rules every renderer must encode, and the composition contract for synthesizing new screens. From there, [`schema/manifest.json`](schema/manifest.json) enumerates every family, every sub-component, every screen recipe, the resolved-token bundles, and the JSON Schemas. Never crawl `schema/components/` to infer the system's shape — the manifest is the contract.

## Running locally

The docs site is the default workspace target:

```bash
npm install
npm run dev
```
