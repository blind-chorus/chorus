# AGENTS.md

Contract for AI design agents (Lovable editor, Cursor, Claude, v0) building UI inside this repo. **This file overrides any default agent behavior.** Read it fully before generating, modifying, or styling any component.

This repo is the Lovable-facing export of [Chorus](https://github.com/blind-dsai/chorus) — a design system that arranges individual voices into harmony through tokens every surface sings from. Your job here is to keep every surface in that harmony.

---

## Read order (do not skip)

1. **This file** — agent contract and hard rules.
2. **[`docs/manifest.json`](docs/manifest.json)** — single entry point. Every family, sub-component, resolved-token bundle, JSON Schema. Use it before crawling.
3. **[`docs/catalog.md`](docs/catalog.md)** — intent → component map. Use to *pick* a chorus component before composing from primitives.
4. **[`docs/DESIGN.md`](docs/DESIGN.md)** — cross-cutting rules: color quartets, focus rings, no-layout strokes, state overlays. Keep loaded.
5. **[`docs/screens/`](docs/screens)** — pre-validated `*.screen.json` recipes. **Prefer varying a recipe over composing from scratch.**
6. **[`docs/components/`](docs/components)** — per-family/sub-component `.md` (intent) + `.spec.json` (machine contract: props, slots, sizes, appearances, states).
7. **[`docs/tokens/`](docs/tokens)** — `resolved.light.json` / `resolved.dark.json` are the authoritative `path → value` tables. Use these when picking a token by name. `resolved.web.*.json` are sparse `≥800px` overlays. `reference.json` / `system.json` / `component.json` expose the dependency graph (palette → semantic → component) — read these when the resolved value alone isn't enough to choose a token.
8. **[`docs/patterns/`](docs/patterns)** — canonical references for full screens (compose, post, main_*, …). Each pattern ships as a paired `.md` (intent + tokens) and `.png` (signed-off pixel target). Read both when building a new screen.
9. **[`src/styles.css`](src/styles.css)** — generated. Contains both shadcn semantic tokens (`--primary`, `--background`, …) and chorus tokens (`--ref-*`, `--sys-*`). Both palettes are live.

---

## Hard rules (non-negotiable)

These are guardrails. Treat a violation the same as a failing test — do not generate the output.

### 1. Chorus components first

- **Always reach for [`@/components/chorus/*`](src/components/chorus) first** when a UI primitive is needed. It already encodes the design language.
- Fall back to [`@/components/ui/*`](src/components/ui) (shadcn) **only when no chorus equivalent exists** for the primitive.
- Never wrap a chorus component to restyle it. If you need a new variant, that is a chorus change — flag it; do not patch locally.

### 2. Token-only color, type, space, radius

Every visible value MUST resolve to a chorus token. No literal hex, no `rgb()`, no `color-mix()`, no magic px.

- **Colors** → `var(--sys-color-*)` (e.g. `--sys-color-surface`, `--sys-color-onSurface`, `--sys-color-outlineVariant`). Use `--ref-palette-*` only if no semantic alias fits.
- **Typography** → `var(--sys-typo-*)` (size, weight, line, tracking — apply as a group).
- **Spacing** → `var(--sys-layout-page-*)`, `--sys-layout-container-*`, `--sys-layout-stack-*`, `--sys-layout-inline-*`. Never `px` for gaps/padding.
- **Radius** → `var(--sys-radius-*)`.
- **Border width** → `var(--sys-borderWidth-*)`.

The shadcn semantic tokens (`--primary`, `--background`, `--card`, …) remain available for shadcn primitives, but **prefer chorus tokens for any styling you author**.

### 3. Color pairs travel together

`sys.color.<role>Container` foreground MUST be `sys.color.on<Role>Container`. Never split the pair. If a pair feels off, that is a token tuning task upstream.

### 4. No-layout strokes & focus rings

Edge strokes are inset `box-shadow`, never `border:` (which reflows). Focus rings are `::after` overlays. State/focus MUST NOT change box dimensions. Always `box-sizing: border-box`.

### 5. States compose via overlay

Hover / pressed / focused / disabled overlay the resolved appearance using `DESIGN.md`'s recipe. Do not invent per-component state recipes.

### 6. One geometry across a flow

Bar/row/chrome heights are stable across screens. If a navigation-bar is `56px`, it stays `56px` everywhere.

### 7. Preview/demo strings are English

Even when matching Korean source screenshots. Component samples ship English placeholder content.

---

## Folder ownership

| Path | Owner | Editing |
| --- | --- | --- |
| `src/components/chorus/` | Chorus (generated) | **Read-only** — overwritten on next sync |
| `src/components/ui/` | shadcn / Lovable | Lovable editor may add/edit |
| `src/routes/` | Both | Compose using chorus components and tokens |
| `src/styles.css` | Generated | **Read-only** — tokens come from chorus repo |
| `src/components/chorus/styles.css` | Chorus (generated) | **Read-only** — imported by `__root.tsx` |
| `docs/` | Chorus (generated) | **Read-only** — reference material (manifest, specs, screens, tokens, patterns) |
| `AGENTS.md` (this file) | Chorus (generated) | **Read-only** |

If you need to add a route, place it under `src/routes/` and compose using chorus components + tokens per the rules above.

---

## When in doubt

- A color you want isn't in the tokens → pick the closest semantic role; do not invent a hex.
- A spacing value you want isn't a token step → use the nearest token; do not introduce a one-off `px`.
- A component you want doesn't exist in chorus → use a shadcn primitive but style it with chorus tokens only (no raw Tailwind color utilities like `bg-blue-500`).
- A pattern feels novel → first check `docs/patterns/` for a canonical screen that already solves it.
