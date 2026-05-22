# AGENTS.md

Contract for AI design agents (Lovable editor, Cursor, Claude, v0) building UI inside this repo. **This file overrides any default agent behavior.** Read it fully before generating, modifying, or styling any component.

> Hand-maintained mirror of the root [`../AGENTS.md`](../AGENTS.md), tightened for the Lovable surface. Not auto-generated — keep aligned manually when the root contract changes.

The four guardrails this contract enforces (mapped to the design principles below):

| Guardrail               | Principle                                                              |
| ----------------------- | ---------------------------------------------------------------------- |
| **Chorus First**        | §1 Design-system-first + §2 Component flexibility (adapt, do not fork) |
| **LEGO-brick assembly** | §4 Lego-block composition                                              |
| **Fallback rule**       | §3 New surfaces stay token-true (no hardcoded values, ever)            |
| **UX alignment**        | §5 UX-pattern consistency (predictable interaction language)           |

This repo is the Lovable-facing export of [Chorus](https://github.com/blind-dsai/chorus) — a design system that arranges individual voices into harmony through tokens every surface sings from. Your job here is to keep every surface in that harmony.

---

## When the user's prompt does not mention components

The prompts you receive from the Lovable editor will almost never name Chorus components. They will describe screens in product language ("header card", "article card", "filter row", "stage tabs", "clean and minimal", "subtle hierarchy"). **The absence of component names is not permission to invent primitives.** It is your job to translate intent → Chorus component before generating any markup.

Apply this routing every time, regardless of how the prompt is worded:

| If the prompt says…                                             | You compose with…                                              |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| top bar, app bar, header bar, title bar                         | `NavigationBar` (home / page / search by screen kind)          |
| header card, summary card, labeled section                      | `Section` (with `label` + optional `headerAction`)             |
| article card, post card, recommended reading, feed item         | `Feed` (with `thumbnail`, `engagement`, etc.)                  |
| company row, settings row, picker row, menu row                 | `List` (with `Thumbnail` leading where appropriate)            |
| insight, aside, callout, "현직자들이 말하는 것" style box       | `Callout` (`default` or `accent`)                              |
| filter chips, topic chips, tag row                              | `Chip` (`filter` or `tag`)                                     |
| stage tabs, segmented tabs, section tabs                        | `Tabs` (`underline` / `rounded` / `segmented`)                 |
| primary CTA / commit                                            | `Button` (standard, filled)                                    |
| "See all", "더 보기", "변경", inline link CTA                   | `Button variant="text" appearance="accent"`                    |
| floating canonical commit                                       | `Button variant="fab"`                                         |
| avatar, company logo, leading image, post thumbnail             | `Thumbnail` (with `src` or `/placeholder_thumbnail.png`)       |
| unread count, numeric pill                                      | `Badge`                                                        |
| confirmation prompt                                             | `Dialog`                                                       |
| one-thumb action sheet                                          | `BottomSheet`                                                  |
| transient post-action confirmation                              | `Toast`                                                        |
| trigger-anchored hint                                           | `Tooltip`                                                      |
| labeled single-line input                                       | `FormField variant="input"`                                    |

The full mapping is in `docs/catalog.md` — when in doubt, open it before composing.

### Tone-adjective disarming

When the prompt uses tone adjectives ("clean", "minimal", "subtle", "no decoration", "not a concept poster", "white background"), they describe **information density and chrome restraint**, not chromatic absence. You must still:

- Carry brand color on key CTAs (`appearance="accent"` text buttons), active tab indicators (`Tabs variant="underline"` already handles this), and semantic accents (likes, urgency, selection state).
- Fill every image area with a real `<Thumbnail>` / `Feed.thumbnail` / `Callout.thumbnail` slot, defaulting to `/placeholder_thumbnail.png` when no context-specific asset is inferable (see §9 below).
- Render rows as `List`, cards as `Section` / `Feed` / `Callout`, not as bordered divs.

A "clean Korean product screen" rendered as gray text on white with no images and no brand accent is a **failed translation** of the prompt, not a faithful one. The seed at [`src/routes/index.tsx`](src/routes/index.tsx) is the reference for how to balance restraint with brand presence.

See [`DESIGN_PRINCIPLES.md`](DESIGN_PRINCIPLES.md) for the user-facing version of this contract — the five design principles, copy-paste preamble, intent map, and the list of anti-patterns to refuse.

---

## Design principles

The five directives every Chorus agent applies before reaching for hex values or generic UI libraries. Read these first; they govern every screen you compose. Apply them in order — later principles never override earlier ones.

1. **Design-system-first (Source of Truth).** Chorus is the source of truth for every surface you design. Start from Chorus tokens, components, and patterns — not from generic UI libraries, screenshot inference, or invented values. Begin every task by reading `docs/manifest.json` + `docs/catalog.md`.
2. **Component flexibility — extrapolate, don't fork.** Chorus components ship with reference compositions and per-spec guidelines. Read the intent and respect each component's anatomy invariants (slot grammar, sizing tokens, state contract), but feel free to flex how a component is composed (slot fill, layout placement, modifier props) to fit a specific UI/UX context. The contract is the token bindings and the spec's slot rules, not the example screenshot. Never wrap a chorus component just to restyle it — re-compose with the slots the component already gives you.
3. **New surfaces stay token-true.** When Chorus has no component for what the surface needs, design a brand-new screen or primitive. The design MUST still resolve every color, spacing, typography, radius, and border-width through Chorus design tokens and the foundation rules in `docs/DESIGN.md`. No raw hex, no off-scale px, no third-party type ramp — that is the floor regardless of how novel the composition is.
4. **Lego-block composition.** Build new surfaces by combining and extending existing Chorus components like Lego blocks — nest, group, sequence, and re-purpose primitives in creative arrangements. Token usage stays non-negotiable; the components themselves are the flexible part. A novel screen should still read as one harmony with the rest of the system — a user landing on it should not feel they crossed into a different product.
5. **UX-pattern consistency.** Pick components from the interaction the user expects — Dialog for modal commits, BottomSheet for committed-sheet flows, Toast for non-blocking feedback, List for menus/pickers, Feed for authored content streams. Across a single flow, behavior, motion, and affordance language stay predictable; do not reach for a Chip when the user expects a Button, or a Dialog when a Toast is the right rung.

The "Hard rules" below are the machine-checkable carve-outs of these principles. The principles tell you *how to think*; the hard rules tell you *what not to ship*.

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
9. **[`src/styles.css`](src/styles.css)** — generated. The chorus tokens (`--ref-*`, `--sys-*`) are the design system. The shadcn semantic tokens (`--primary`, `--background`, …) ship as a Tailwind baseline only so the pipeline boots — do not author against them.

---

## Hard rules (non-negotiable)

These are guardrails. Treat a violation the same as a failing test — do not generate the output.

### 1. Chorus components only

- **Every UI primitive comes from [`@/components/chorus/*`](src/components/chorus).** It encodes the design language — tokens, spacing, radius, focus rings, color pairs.
- **No shadcn fallback.** This export deliberately does NOT ship `src/components/ui/`. Do not add it back, do not import from it, do not regenerate shadcn primitives from the editor. If a primitive you need isn't in chorus, that is a chorus gap — flag it (open an issue / PR against the chorus repo). Do not paper over the gap with shadcn or raw Tailwind.
- Never wrap a chorus component to restyle it. If you need a new variant, that is a chorus change — flag it; do not patch locally.

### 2. Token-only color, type, space, radius

Every visible value MUST resolve to a chorus token. No literal hex, no `rgb()`, no `color-mix()`, no magic px.

- **Colors** → `var(--sys-color-*)` (e.g. `--sys-color-surface`, `--sys-color-onSurface`, `--sys-color-outlineVariant`). Use `--ref-palette-*` only if no semantic alias fits.
- **Typography** → `var(--sys-typo-*)` (size, weight, line, tracking — apply as a group).
- **Spacing** → `var(--sys-layout-page-*)`, `--sys-layout-container-*`, `--sys-layout-stack-*`, `--sys-layout-inline-*`. Never `px` for gaps/padding.
- **Radius** → `var(--sys-radius-*)`.
- **Border width** → `var(--sys-borderWidth-*)`.

The shadcn semantic tokens (`--primary`, `--background`, `--card`, …) ship as a Tailwind boot baseline only. **Do not author against them.** New styles MUST use chorus tokens.

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

### 8. Link-affordance Text Buttons use `accent`

When a Text Button reads as a *link* — a section-header trailing `See all` / `See more`, a card-header `Follow`, an inline `View details` next to body copy — pick `appearance="accent"` so the navigational intent carries chromatic emphasis. `default` (onSurfaceVariant) is reserved for quieter inline commits that should recede into the body copy. Only fall back to `default` when the parent surface already carries enough chromatic weight that an `accent` label would compete.

### 9. Image areas are image-typed and context-swappable

Any spec field marked `"assetType": "image"` (props **or** slots — currently `Thumbnail.src` and the `Thumbnail.image` slot) is an **image area**. Treat it like a typed asset slot, not a free-form string.

- **Default fill.** Use the spec's `placeholder` URL (`/placeholder_thumbnail.png` for Thumbnail and FeedAd media). The asset is shipped at that path inside this repo — `<Thumbnail src="/placeholder_thumbnail.png" alt="…" />` resolves out of the box. Never leave `src` empty when the design intent is "an image goes here".
- **Runtime fallback is the same placeholder.** Image areas (`.chorus-thumbnail__image`, `.chorus-feed-ad__media`) paint `/placeholder_thumbnail.png` as a `background-image` (cover, center) over a `surfaceContainerHigh` base. So when the runtime `<img>` is missing or fails to load, the slot still resolves to the placeholder image — never an empty surface tone. **This fallback is a safety net for load failures only**; design-time scaffolds MUST still pass `/placeholder_thumbnail.png` through `src` explicitly so the contract is visible in the JSX rather than hidden in the CSS layer.
- **Context-aware swap.** When the surrounding composition makes the subject clear — a named channel ("Engineering", "Campus"), a known author, a brand logo, a topic tag, a category — replace the placeholder with a context-appropriate image (a real or AI-generated asset that matches the subject). The placeholder is the scaffold default, **not** the final value; if you can infer a better-fitting image from the route's content, swap it. **When you cannot infer a context-appropriate image, fall back to `/placeholder_thumbnail.png`** — never to an icon-in-tinted-circle, never to an empty `src`, never to a third-party stock URL invented from scratch.
- **Stay inside the contract.** A swap only changes the `src` URL — never the slot's shape, footprint, or surrounding chrome. The Thumbnail still owns its diameter, corner shape, and badge slots.
- **No glyph-in-circle substitutes.** Image areas resolve to `<img>`, not to an icon-in-a-tinted-circle. If the design calls for a glyph instead of an image, that is a different slot (e.g. `Callout.icon`) — pick that one, not Thumbnail with a glyph crammed inside.

---

## Folder ownership

| Path | Owner | Editing |
| --- | --- | --- |
| `src/components/chorus/` | Chorus (generated) | **Read-only** — overwritten on next sync |
| `src/components/ui/` | — | **Do not create.** No shadcn fallback; missing primitives go upstream as chorus issues |
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
- A component you want doesn't exist in chorus → that's a chorus gap. Open an issue / PR against the chorus repo. Do NOT introduce a shadcn primitive or hand-roll a Tailwind component as a workaround.
- A pattern feels novel → first check `docs/patterns/` for a canonical screen that already solves it.
