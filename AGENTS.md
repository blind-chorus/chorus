# AGENTS.md

> Entrypoint for AI agents, external renderers, and design tools (Lovable, v0, Cursor, Figma plugins, Claude Design) that consume the Chorus design system to **compose new prototypes** out of existing components.

The human-facing README is [`README.md`](README.md). This file is the contract for *machines*: what to read, in what order, and what rules to obey when synthesizing a screen.

---

## MCP server (recommended access path)

This repository ships an MCP server at [`apps/mcp-server`](apps/mcp-server) that exposes the schema directly to any MCP client (Claude Desktop, Cursor, Claude Code, Lovable). Tools enumerate families/specs/screens and validate compositions; resources expose `AGENTS.md`, the manifest, the catalog, `DESIGN.md`, and the resolved token bundles. See [`apps/mcp-server/README.md`](apps/mcp-server/README.md) for client wiring.

If your client can't speak MCP, fall back to reading the files directly — read order below.

## Read order (do not skip)

Read these in order. Each step narrows scope.

1. **[`schema/manifest.json`](schema/manifest.json)** — the single entry point. Lists every family, every sub-component, every resolved-token bundle, and the JSON Schemas that validate specs. Never crawl `schema/components/` to infer the system's shape.
2. **[`schema/catalog.md`](schema/catalog.md)** — intent → component map. "I need a search header" / "I need a confirmation surface" / "I need a row list." Use this to *pick* components before reading their specs.
3. **[`schema/screens/`](schema/screens)** — pre-validated screen recipes. Each `*.screen.json` is a verified composition of families that already passes the system's rules. **Prefer variation of a recipe over from-scratch composition.**
4. **`schema/components/<family>/<sub>.spec.json`** — the per-sub-component contract. Props, slots, sizes, appearances, states, behavior. Token bindings reference the three-tier system below.
5. **[`schema/tokens/resolved.light.json`](schema/tokens/resolved.light.json)** / **[`resolved.dark.json`](schema/tokens/resolved.dark.json)** — flat `path → { $value, $type }` maps. Use these for rendering; only fall back to `reference.json` + `system.json` if you need the dependency graph. The `resolved.web.*.json` files are sparse overlays for the `≥800px` breakpoint.
6. **[`schema/DESIGN.md`](schema/DESIGN.md)** — cross-cutting rules every spec defers to: color quartets, focus ring composition, no-layout strokes, state overlays. Read once; keep it loaded as context.

---

## Hard rules (violating these breaks the system)

These rules are *not* expressible in the JSON Schemas alone. Agents MUST encode them as guardrails.

1. **Token-only color, type, space, radius.** Every visible value MUST resolve to a `sys.*` (or `ref.*` when no semantic alias exists) token from `resolved.*.json`. No literal hex, no ad-hoc `color-mix()`, no magic numbers. The one exception is exact pixel values already present in a spec's `sizing` block (e.g. `"160px"` minWidth on `standard`).
2. **Color pairs travel together.** When a surface uses `sys.color.<role>Container`, its foreground MUST be `sys.color.on<Role>Container`. If the visual doesn't work, **retune the token, never split the pair.** See [memory: token pairs].
3. **No-layout strokes & focus rings.** Edge strokes are inset `box-shadow`, never `border:`. Focus rings are `::after` overlay layers. State changes and focus indicators MUST NOT reflow the control. Always set `box-sizing: border-box`. See [`schema/DESIGN.md`](schema/DESIGN.md).
4. **Slot contract is closed.** A spec's `slots` enumerates every region the component owns. Do not introduce undeclared slots. Do not nest a component into a slot whose `slotCompatibility` (when present) forbids that family.
5. **States compose via overlay, not replacement.** Hover / pressed / focused / disabled apply on top of the resolved `appearance`. Read the state recipe from `DESIGN.md` — do not invent per-component recipes.
6. **One geometry across a navigation flow.** Bars, list rows, and chrome heights are stable across screens by design (e.g. all three `navigation-bar` sub-components share `56px` min-height and `8/8` padding). When composing a flow, keep these constants.
7. **Preview / demo strings are English.** Every demo string an agent generates for `examples/` or `previews/` must be English, even when source screenshots are Korean.

---

## How to compose a new screen

Preferred path:

1. Find the closest recipe in `schema/screens/`. Clone it.
2. Swap families inside its slots — only swap to families that satisfy the slot's `accepts` list.
3. Re-resolve tokens for the active theme (`resolved.light` or `resolved.dark`).
4. Run the validators below before declaring done.

From-scratch path (only if no recipe is close):

1. Sketch the screen as a `screen.json` document (see [`schema/screens/README.md`](schema/screens/README.md) for the shape).
2. For each slot, pick a family from `catalog.md` and a sub-component from the family's `family.json`.
3. Cross-check the family-pair rules below.

### Composition rules (cross-component)

- **NavigationBar always sits at the top of a screen.** Use `home` for landing screens, `page` for drill-ins, `search` for search surfaces. Do not stack two NavigationBars.
- **BottomSheet and Dialog are modal.** Do not place them inline. Pair each modal with a triggering action elsewhere on the screen.
- **FAB is the single canonical commit of a surface.** At most one FAB per screen. Destructive primary commits belong in a Dialog confirmation, not a FAB.
- **List rows are the click target.** A leading control (radio, thumbnail) is never a separate hit target.
- **ChannelRail is horizontal navigation; ChannelList is vertical.** They are not interchangeable.
- **Feed and List are different surfaces.** Feed is for authored content streams (author + body + footer); List is for menus / settings / pickers.

---

## Renderer guidance

The `@blind-chorus/ui` package is workspace-only and source-distributed. External tools choose ONE of:

- **(a) Compile the JSX directly.** Import from `packages/ui/src/index.js`. Load `packages/ui/src/styles.css` once at the app entry. The JSX emits inline `--<component>-*` plumbing vars; the static rules in `styles.css` consume them.
- **(b) Re-render from the spec.** Read `schema/components/<family>/<sub>.spec.json` and emit your renderer's equivalent. This is the path for Figma plugins, Lovable-style synth, and non-React runtimes. You MUST encode all seven hard rules above.

When in doubt, prefer (a) — it carries the no-layout-stroke and focus-ring rules for free.

---

## Validators (run before declaring a composition done)

The screen-recipe validator is implemented at [`schema/lint/validate-screen.mjs`](schema/lint/validate-screen.mjs).

```bash
npm run lint                 # everything below
npm run lint:screens         # validate every recipe in manifest.json#/screens
npm run lint:tokens          # token usage + hex collisions (informational by default)
npm run test:screens         # run the screen validator's own negative-case suite
node schema/lint/validate-screen.mjs settings    # one recipe by slug
node schema/lint/validate-tokens.mjs --strict    # fail on cross-family hex collisions
```

What is currently checked:

**Screen recipes** ([`validate-screen.mjs`](schema/lint/validate-screen.mjs)):
1. **Schema-level.** Every region references a real `family` in `manifest.json`; `subcomponent` (when given) exists in that family.
2. **Slot fill.** Every `required: true` slot (excluding `intrinsic: true` chrome) is provided by `props`, `items[*]`, or excused by a `note`.
3. **Slot compatibility.** Where a slot declares `accepts: [...]`, a nested family reference at that slot is in the list.
4. **Screen-level rules.** ≤1 `navigation-bar`, ≤1 `button/fab`, every `bottom-sheet` / `dialog` has a paired trigger elsewhere.
5. **Swappable lists.** Region names exist; family slugs are real.

**Tokens** ([`validate-tokens.mjs`](schema/lint/validate-tokens.mjs)):
6. **Token usage.** Every `sys.*` / `ref.*` / `comp.*` reference in `schema/components/*.spec.json` and `packages/ui/src/**/*.jsx` resolves to a key in `resolved.<theme>.json`. Hard fail.
7. **Hex collisions.** Within a single theme, any two `sys.color.*` keys resolving to the same hex are reported. Cross-family collisions (e.g. `error` vs `onBrandContainer`) print informationally by default — they're often intentional in a monochromatic system; pass `--strict` to fail.

What is **not** yet automated and remains an agent responsibility:

8. **Visual regression.** The composition renders without errors under both `resolved.light` and `resolved.dark`. Use the docs site (`npm run dev`) for spot-checks.

---

## What this system does NOT cover (yet)

Be explicit about gaps so agents don't fabricate:

- **Layout primitives** (Stack / Inset / Divider / SafeArea) are not yet componentized. Use the `sys.layout.*` and `sys.space.*` tokens directly on a `<div>`. Do not invent a layout component.
- **Motion tokens** are partial; transitions in specs reference `sys.motion.*` where defined and fall back to CSS defaults otherwise.
- **Form validation, toasts, snackbars, tooltips, menus (non-bottom-sheet), date pickers** — not yet in the system. Do not synthesize. Ask the user.
- **`comp.*` tier of tokens is intentionally empty.** Do not write to it.

---

## Glossary

- **family** — a group of related sub-components sharing one anatomy (`button`, `tabs`, `navigation-bar`).
- **sub-component** — a concrete form within a family (`standard`, `underline-tabs`, `home-navigation-bar`).
- **spec** — `<sub>.spec.json`: the machine-readable contract for one sub-component.
- **family.json** — the family-level index: lists sub-components, family-wide axes (e.g. `flavor: ["default", "destructive"]`).
- **recipe** — a validated composition of families into a screen, stored in `schema/screens/`.
- **resolved tokens** — `tokens/resolved.<theme>.json`: flat, fully-dereferenced token bundles for rendering.

[memory: token pairs]: claude-memory/feedback_token_pairs.md
