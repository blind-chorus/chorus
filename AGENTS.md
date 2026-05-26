# AGENTS.md

Entrypoint for AI agents, external renderers, and design tools (Lovable, v0, Cursor, Figma plugins, Claude Design) consuming Chorus to compose new prototypes. Human-facing readme: [`README.md`](README.md). This file is the machine contract.

---

## Design principles

Five directives. Apply in order; later directives never override earlier ones.

1. **Design-system-first (Source of Truth).** Chorus is the source of truth for every surface you design. Start from Chorus tokens, components, and patterns — not from generic UI libraries, screenshot inference, or invented values. Begin every task by reading [`schema/manifest.json`](schema/manifest.json) + [`schema/catalog.md`](schema/catalog.md).
2. **Component flexibility — extrapolate, don't fork.** Chorus components ship with reference compositions and per-spec guidelines. Read the intent and respect each component's anatomy invariants (slot grammar, sizing tokens, state contract), but feel free to flex how a component is composed (slot fill, layout placement, modifier props) to fit a specific UI/UX context. The contract is the token bindings and the spec's slot rules, not the example screenshot. The family's `visualReuse` flag in `<family>.family.json` says how far that flexibility extends — `"open"` families (most of the system: section, banner, feed, list, button, chip, badge, navigation-bar, tab-bar, tabs, suggestion-list, avatar-rail, thumbnail) may be reached for on **visual-fit grounds even when the brief's intent does not match `useCases` verbatim**; `"locked"` families (dialog, bottom-sheet, toast, tooltip, form-field — interaction-contract primitives) MUST only be used in their canonical role. Never wrap a chorus component to restyle it — re-compose with the slots the component already gives you.
3. **New surfaces stay token-true.** When Chorus has no component for what the surface needs, design a brand-new screen or primitive. The design MUST still resolve every color, spacing, typography, radius, and border-width through Chorus design tokens and the foundation rules in [`schema/DESIGN.md`](schema/DESIGN.md). No raw hex, no off-scale px, no third-party type ramp — that is the floor regardless of how novel the composition is.
4. **Lego-block composition.** Build new surfaces by combining and extending existing Chorus components like Lego blocks — nest, group, sequence, and re-purpose primitives in creative arrangements. Token usage stays non-negotiable; the components themselves are the flexible part. A novel screen should still read as one harmony with the rest of the system — a user landing on it should not feel they crossed into a different product.
5. **UX-pattern consistency.** Pick components from the interaction the user expects when that interaction is the whole point — Dialog for modal commits, BottomSheet for committed-sheet flows, Toast for non-blocking feedback, Tooltip for trigger-anchored hints, FormField for real text entry. These five families are `visualReuse: "locked"` and MUST NOT be borrowed for the visual shape alone — their behavior (focus trap, auto-dismiss, ARIA live region, hover/focus trigger, `<input>` semantics) is the contract. The other thirteen families (`visualReuse: "open"`) carry interaction defaults too — List for menus/pickers, Feed for authored content, Chip vs Button for facet vs commit — but those defaults are *first suggestions*, not rules; the agent may pick by visual fit when the design calls for it. Across a single flow, keep behavior, motion, and affordance language predictable regardless of which tier the components come from.

The "Hard rules" below are the machine-checkable carve-outs of these principles — the principles tell you *how to think*; the hard rules tell you *what not to ship*.

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
7. **[`patterns/`](patterns)** — canonical pixel references + per-screen notes (intent, tokens, components). Consult when matching a new composition to a signed-off visual target.

---

## Hard rules

Not expressible in JSON Schemas. Agents MUST encode as guardrails.

1. **Token-only color, type, space, radius.** Every visible value resolves to a `sys.*` (or `ref.*` if no semantic alias) from `resolved.*.json`. No literal hex, no `color-mix()`, no magic numbers. Exception: exact pixel values already in a spec's `sizing` block (e.g. `"160px"` minWidth on `standard`).
2. **Color pairs travel together.** `sys.color.<role>Container` foreground MUST be `sys.color.on<Role>Container`. Retune the token; never split the pair. See [memory: token pairs].
3. **No-layout strokes & focus rings.** Edge strokes are inset `box-shadow`, never `border:`. Focus rings are `::after` overlays. State/focus MUST NOT reflow the control. Always `box-sizing: border-box`. **Cards hosting a full-bleed child with its own opaque fill (cover band, hero thumbnail, header band under `overflow: hidden`) promote the outline stroke to the same `::after` overlay layer the focus ring uses** — an inset shadow on the card itself paints below the child and gets masked at edges the child touches. See [`schema/DESIGN.md`](schema/DESIGN.md).
4. **Slot contract is closed.** `slots` enumerates every region. Do not introduce undeclared slots. Respect `slotCompatibility` when present.
5. **States compose via overlay, not replacement.** Hover/pressed/focused/disabled overlay the resolved `appearance`. Use `DESIGN.md`'s recipe; do not invent per-component recipes.
6. **One geometry across a navigation flow.** Bar/row/chrome heights are stable across screens (e.g. all three `navigation-bar` subs share `56px` min-height, `8/8` padding).
7. **Preview/demo strings are English.** Even when source screenshots are Korean.
8. **Link-affordance Text Buttons use `accent`.** Section-header `See all`, card-header `Follow`, inline `View details` — any Text Button reading as a link picks `appearance="accent"` so navigational intent carries chromatic emphasis. `default` is reserved for inline commits that should recede into body copy. Full rule: [text.spec.json:appearances.accent.linkAffordanceRecommendation](schema/components/button/text.spec.json).
9. **Image areas are image-typed and context-swappable — one universal placeholder.** Any spec field marked `"assetType": "image"` (props or slots — `Thumbnail.src` / `Thumbnail.image`, `FeedAd.media.src` / `FeedAd.media`, `ProfileCarousel.items[].cover.src`, and every future image-typed slot) is a typed asset slot. Fill with `/placeholder.png` — the **single universal Chorus image-area placeholder** — when scaffolding; the same asset wires as the **runtime CSS fallback** (`background-image` on the image-area layer) so a missing or failed `<img>` still resolves the slot to the placeholder image rather than an empty surface tone. The placeholder paints the lowercase Blind wordmark on a calm neutral surface and is `object-fit: cover` -ed to the slot's intrinsic footprint — aspect ratio preserved, cropped to fill — so it never reshapes the slot. When the surrounding composition gives a clear subject (named channel, known author, brand, topic), swap the placeholder for a context-appropriate image — only the `src` URL changes, never the slot's footprint or chrome. **When no context-appropriate image can be inferred, fall back to `/placeholder.png`** rather than to a glyph-in-tinted-circle, an inline SVG wordmark, an empty `src`, or an invented stock URL. Glyph-bearing slots (e.g. `Banner.icon`) are a different contract.

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
- **AvatarRail = horizontal entity quick-nav (avatar + label). SuggestionList = vertical swipeable block of follow-suggestion rows.** Not interchangeable.
- **Feed vs List.** Feed = authored content streams (author + body + footer). List = menus/settings/pickers.
- **One shared horizontal gutter — never double-pay padding.** The page shell pays `layout.page.*` (default `layout.page.md`) once and full-bleed components (Section, ListRow, NavigationBar, Feed item, Banner, AvatarRail, Chip group, …) stretch edge-to-edge inside it; they MUST NOT also wrap themselves in another `layout.container.md` of horizontal padding. Stacking `layout.page.md` + `layout.container.md` makes each component a different inset from the page edge, so heading text, list content, and chip rows visibly fail to align down a shared left rail. The contract is the *visual* `layout.page.md` from the screen edge (DESIGN.md → [Section horizontal padding](schema/DESIGN.md)) — pay it once, at the page shell.
- **The one-inset rule applies recursively — bounded surfaces hosting full-bleed children opt out via negative margin.** Bounded surfaces (Card, Dialog, BottomSheet content slot, Sheet body, padded Section interior) own their own `layout.container.*` padding for direct content (titles, body paragraphs, form fields, primary action). But when a *full-bleed* component (List, Feed, AvatarRail, Chip group, Tabs rail) is placed inside one of these surfaces, the SAME double-pay collision happens: surface padding + child's own row padding = two insets stacked, and row content lands further from the card edge than the surface's other content. The full-bleed child MUST stretch to the surface's content-box edge so its OWN internal padding becomes the visual inset. The canonical idiom is to negate the surrounding container padding on the child: `style={{ marginInline: 'calc(-1 * var(--sys-layout-container-md))', width: 'calc(100% + 2 * var(--sys-layout-container-md))', maxWidth: 'none' }}`. Visual check: row content (radio glyph, list-item primary text, chip group's first chip, feed-item author block) MUST land on the same vertical line as the surface's titles, body paragraphs, and action labels above/below the list. Established precedent: the `bottom-sheet/overflow` and `bottom-sheet/nested-step` recipes both use this idiom for their hosted Lists.
- **Group for visual alignment, not for component packaging.** When composing a screen, the grouping `<div>`s you introduce exist to enforce a single shared left/right rail across siblings — not to wrap each component in its own bounding box that re-applies the component's "natural" `layout.container.*`. If two siblings (a section header and the list below it, a chip rail and the feed below it) belong to the same vertical region, they share one parent that owns the horizontal inset; each child stretches to that parent's content box. The same rule governs vertical rhythm: pay it once via `gap: var(--sys-layout-stack-*)` on the parent, not `margin` on each child.

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
