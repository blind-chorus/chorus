# AGENTS.md

Entrypoint for AI agents, external renderers, and design tools (Lovable, v0, Cursor, Figma plugins, Claude Design) consuming Chorus to compose new prototypes. Human-facing readme: [`README.md`](README.md). This file is the machine contract.

---

## MCP server (preferred access)

MCP server at [`apps/mcp-server`](apps/mcp-server) exposes the schema to any MCP client (Claude Desktop, Cursor, Claude Code, Lovable). Tools enumerate families/specs/screens and validate compositions; resources expose `AGENTS.md`, the manifest, the catalog, `DESIGN.md`, and resolved token bundles. Wiring: [`apps/mcp-server/README.md`](apps/mcp-server/README.md). Fall back to direct file reads in the order below if MCP is unavailable.

## Read order (do not skip)

1. **[`schema/manifest.json`](schema/manifest.json)** — single entry point. Every family, sub-component, resolved-token bundle, JSON Schema. Never crawl `schema/components/` to infer system shape.
2. **[`schema/catalog.md`](schema/catalog.md)** — intent → component map. Use to *pick* components before reading specs.
3. **[`schema/screens/`](schema/screens)** — pre-validated `*.screen.json` recipes. **Prefer varying a recipe over from-scratch composition.**
4. **`schema/components/<family>/<sub>.spec.json`** — per-sub-component contract: props, slots, sizes, appearances, states, behavior.
5. **[`schema/tokens/resolved.light.json`](schema/tokens/resolved.light.json)** / **[`resolved.dark.json`](schema/tokens/resolved.dark.json)** — flat `path → { $value, $type }` for rendering. Fall back to `reference.json` + `system.json` only for the dependency graph. `resolved.web.*.json` are sparse `≥800px` overlays.
6. **[`schema/DESIGN.md`](schema/DESIGN.md)** — cross-cutting rules every spec defers to (color quartets, focus rings, no-layout strokes, state overlays). Keep loaded.
7. **[`docs/keyscreens/`](docs/keyscreens)** — canonical pixel references + per-screen notes (intent, tokens, components). Consult when matching a new composition to a signed-off visual target.

---

## Hard rules

Not expressible in JSON Schemas. Agents MUST encode as guardrails.

1. **Token-only color, type, space, radius.** Every visible value resolves to a `sys.*` (or `ref.*` if no semantic alias) from `resolved.*.json`. No literal hex, no `color-mix()`, no magic numbers. Exception: exact pixel values already in a spec's `sizing` block (e.g. `"160px"` minWidth on `standard`).
2. **Color pairs travel together.** `sys.color.<role>Container` foreground MUST be `sys.color.on<Role>Container`. Retune the token; never split the pair. See [memory: token pairs].
3. **No-layout strokes & focus rings.** Edge strokes are inset `box-shadow`, never `border:`. Focus rings are `::after` overlays. State/focus MUST NOT reflow the control. Always `box-sizing: border-box`. See [`schema/DESIGN.md`](schema/DESIGN.md).
4. **Slot contract is closed.** `slots` enumerates every region. Do not introduce undeclared slots. Respect `slotCompatibility` when present.
5. **States compose via overlay, not replacement.** Hover/pressed/focused/disabled overlay the resolved `appearance`. Use `DESIGN.md`'s recipe; do not invent per-component recipes.
6. **One geometry across a navigation flow.** Bar/row/chrome heights are stable across screens (e.g. all three `navigation-bar` subs share `56px` min-height, `8/8` padding).
7. **Preview/demo strings are English.** Even when source screenshots are Korean.

---

## Composing a new screen

Preferred:
1. Find the closest recipe in `schema/screens/`. Clone it.
2. Swap families inside slots — only to families in the slot's `accepts` list.
3. Re-resolve tokens for active theme.
4. Run validators below.

From scratch (only if no recipe is close):
1. Sketch a `screen.json` (shape: [`schema/screens/README.md`](schema/screens/README.md)).
2. For each slot, pick a family from `catalog.md` and a sub from the family's `family.json`.
3. Cross-check the rules below.

### Composition rules

- **NavigationBar at top.** `home` for landing, `page` for drill-ins, `search` for search. Never stack two.
- **BottomSheet and Dialog are modal.** Never inline. Pair each with a triggering action.
- **FAB is the single canonical commit.** ≤1 per screen. Destructive primary commits → Dialog, not FAB.
- **List rows are the click target.** Leading controls (radio, thumbnail) are not separate hit targets.
- **ChannelRail = horizontal nav; ChannelList = vertical.** Not interchangeable.
- **Feed vs List.** Feed = authored content streams (author + body + footer). List = menus/settings/pickers.

---

## Renderer guidance

`@blind-dsai/ui` is workspace-only and source-distributed. External tools pick ONE:

- **(a) Compile the JSX directly.** Import from `packages/ui/src/index.js`. Load `packages/ui/src/styles.css` once. JSX emits inline `--<component>-*` plumbing vars; static rules in `styles.css` consume them.
- **(b) Re-render from the spec.** Read `schema/components/<family>/<sub>.spec.json` and emit equivalent. Path for Figma plugins, Lovable-style synth, non-React runtimes. MUST encode all seven hard rules.

Prefer (a) — carries no-layout-stroke and focus-ring rules for free.

---

## Validators

Screen-recipe validator: [`schema/lint/validate-screen.mjs`](schema/lint/validate-screen.mjs).

```bash
npm run lint                 # everything below
npm run lint:screens         # validate every recipe in manifest.json#/screens
npm run lint:tokens          # token usage + hex collisions (informational by default)
npm run test:screens         # screen validator negative-case suite
node schema/lint/validate-screen.mjs settings    # one recipe by slug
node schema/lint/validate-tokens.mjs --strict    # fail on cross-family hex collisions
```

Checked:

**Screen recipes** ([`validate-screen.mjs`](schema/lint/validate-screen.mjs)):
1. **Schema-level.** Every region's `family` exists in `manifest.json`; `subcomponent` (when given) exists in that family.
2. **Slot fill.** Every `required: true` slot (excluding `intrinsic: true` chrome) is provided by `props`, `items[*]`, or excused by a `note`.
3. **Slot compatibility.** Nested family at a slot is in the slot's `accepts` list.
4. **Screen-level.** ≤1 `navigation-bar`, ≤1 `button/fab`; every `bottom-sheet`/`dialog` has a paired trigger.
5. **Swappable lists.** Region names exist; family slugs are real.

**Tokens** ([`validate-tokens.mjs`](schema/lint/validate-tokens.mjs)):
6. **Token usage.** Every `sys.*`/`ref.*`/`comp.*` in `schema/components/*.spec.json` and `packages/ui/src/**/*.jsx` resolves in `resolved.<theme>.json`. Hard fail.
7. **Hex collisions.** Same-theme `sys.color.*` keys resolving to the same hex are reported. Cross-family collisions print informationally; `--strict` fails.

Not yet automated:

8. **Visual regression.** Composition renders under both `resolved.light` and `resolved.dark`. Use `npm run dev` for spot-checks.

---

## Not covered (yet)

- **Layout primitives** (Stack / Inset / Divider / SafeArea) — not componentized. Use `sys.layout.*` / `sys.space.*` on a `<div>`. Do not invent.
- **Motion tokens** — partial; specs reference `sys.motion.*` where defined, CSS defaults otherwise.
- **Form validation, toasts, snackbars, tooltips, menus (non-bottom-sheet), date pickers** — not in system. Do not synthesize. Ask the user.
- **`comp.*` token tier is intentionally empty.** Do not write to it.

---

## Commit conventions

Conventional Commits. Format: `type(scope): subject`.

- **type** — `feat` (new capability), `fix` (bug), `docs` (docs only), `chore` (deps/tooling/rename), `ci` (workflows), `refactor` (no behavior change), `test`.
- **scope** — the touched surface. Prefer existing scopes from `git log`: `badge`, `toast`, `tokens`, `components`, `docs`, `pages`, `release`. Multi-scope: comma, no space — `feat(toast,tokens): …`.
- **subject** — imperative, lowercase, no trailing period, ≤72 chars. Describe *what changes*, not *why*. Example: `feat(badge): host dot on thumbnail/icon with surface outline`.
- **body** (optional) — one blank line after subject. Use for the *why* or non-obvious constraints. Wrap at ~72.
- **one logical change per commit.** Token retunes, spec edits, and recipe updates that travel together stay together; unrelated cleanup goes in its own commit.
- **schema/spec/token edits** — name the family or token tier in the scope (`feat(button): …`, `chore(tokens): …`). Re-run `npm run lint` before committing — a failing validator is not a commit.
- **screen recipes** — `feat(screens): add settings recipe` or `fix(screens): …`. If the change is a recipe + spec together, scope the dominant surface.
- **never commit** generated `apps/docs/out/`, `node_modules/`, or local `claude-memory` symlink contents.

---

## Glossary

- **family** — group of related sub-components sharing one anatomy (`button`, `tabs`, `navigation-bar`).
- **sub-component** — concrete form within a family (`standard`, `underline-tabs`, `home-navigation-bar`).
- **spec** — `<sub>.spec.json`: machine-readable contract for one sub-component.
- **family.json** — family-level index: sub-components + family-wide axes (e.g. `flavor: ["default", "destructive"]`).
- **recipe** — validated composition stored in `schema/screens/`.
- **resolved tokens** — `tokens/resolved.<theme>.json`: flat, fully-dereferenced bundles.

[memory: token pairs]: claude-memory/feedback_token_pairs.md
