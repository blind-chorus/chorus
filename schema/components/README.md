# @blind-chorus/components

Per-component specifications for the Chorus design system. Each component has its own folder containing a single canonical markdown spec — slots, default bindings, variants, states, and behavior.

## Relationship to `DESIGN.md`

`schema/DESIGN.md` is the **single source of truth for the system as a whole**: token architecture, color, typography, spacing, elevation, state overlays, focus ring composition, accessibility floor, voice. Every component spec in this folder operates **inside that frame** — it never re-defines a Chorus-wide rule, only the composition that is component-specific.

When a component spec mentions tokens, focus behavior, contrast targets, or any cross-cutting rule, it defers to `DESIGN.md` rather than restating the rule. That keeps the global rules in one place and per-component drift out.

## Spec is the source of truth

**The `<family>.md` (or `<family>/<sub>.md`) file is the contract.** Product code, the docs preview, and the live JSX in `apps/docs/components/previews/index.js` all consume this contract; none of them mint new rules on their own. When implementing or modifying a component:

- **Read the spec first.** Slot list, Anatomy table, Sizes, States, Behavior — all decisions live there. Token names listed in the Anatomy table are the values to plug into CSS, not the literal numbers in parentheses (the numbers are reading aids, the token is the contract).
- **The binding table is exhaustive.** If a slot's padding / gap / typo / color / radius / border isn't listed, it inherits from `DESIGN.md`'s system defaults — not from "whatever the preview currently shows."
- **The preview is a derived artefact.** `previews/index.js` only maps a fence id to live JSX so visitors can poke the control while reading the spec. The fence body is the only piece of the preview that is canonical (the import and the props shape are part of the spec); the surrounding visual wrappers (width caps, demo state, stateful wrappers) are docs chrome and are not part of the contract.
- **Detail changes round-trip through the spec.** When a visual detail changes (a hover affordance, a padding token, a divider, a typography role), update the spec md *first*, then update the CSS / JSX to match, then verify the preview. If the change starts in CSS, the spec edit is still required before the change ships — otherwise the next implementer reads stale facts.

The shorthand: **if the spec doesn't say it, it isn't true yet.**

### How the CSS receives the bindings (`--<component>-*` plumbing vars)

`packages/ui/src/styles.css` is plain static CSS — it can't read a `.spec.json`. So each component selector consumes a set of *local* custom properties named `--<component>-*` (`--button-standard-gap`, `--chip-padding-inline`, `--field-slot-gap`, `--button-standard-focus-outer-color`, …). **These are not design tokens** and never appear in `schema/tokens/*.json`; they are indirection plumbing. The component's React file reads the spec's binding (`spec.sizing.gap === "sys.layout.inline.md"`) and emits it at render time as an inline custom property — `style={{ '--button-standard-gap': 'var(--sys-layout-inline-md)' }}` — and the stylesheet just says `gap: var(--button-standard-gap)`. So the *token* (`sys.*` / `ref.*`) lives in `schema/tokens/*.json` and is named in the spec's Anatomy table; the *binding* (which token a slot uses) lives in the `.spec.json`; the `--<component>-*` var is only a renamed pointer the CSS uses to receive it. The extra hop is deliberate: it keeps the binding in the `.spec.json` (the contract every other consumer reads) rather than scattered across CSS rules, and it lets per-variant / per-state values be expressed by class / pseudo-class rules setting the var once instead of repeating the `sys.*` reference. There is **no `comp.*` token tier in use** — it is reserved but intentionally empty; everything is expressed via `sys.*` / `ref.*`. If a component ever needs a binding `sys.*` can't express, the order is the same as any other detail change: write it in the spec md → add a `comp.*` token to `schema/tokens/*.json` → reference `var(--comp-…)` in the CSS / JSX. (A fuller note lives at the top of `packages/ui/src/styles.css`.)

## Machine-readable contract

The prose `.md` files above are the **authoring** contract — the human-readable source of truth. They sit next to a **machine-readable** layer that external consumers (Claude Design, AI agents, the Figma plugin, downstream renderers) read instead of crawling the prose:

```
schema/
├── manifest.json           ← system inventory. Enumerates every family + sub-component, points at tokens, schemas, and packages. **External tools start here.**
├── family.schema.json      ← JSON Schema for a family root spec (`<family>.family.json`).
├── spec.schema.json        ← JSON Schema for a sub-component spec (`<sub>.spec.json`).
└── components/<family>/
    ├── <family>.family.json    ← family root. Names the family, lists its sub-components, declares cross-cutting axes (e.g. button's `flavor: [default, destructive]`).
    ├── <family>.md             ← family authoring page (prose).
    ├── <sub>.spec.json         ← sub-component visual contract (props, slots, sizing, appearance, states).
    └── <sub>.md                ← sub-component authoring page (prose).
```

Two contracts, two purposes:
- **`<family>.family.json` declares structure** — what sub-components exist, what cross-cutting axes the family owns, where the prose lives. This is what an external tool reads to discover the system's taxonomy. Without it, tools fall back to their own canonical taxonomy (Material's `filled / tonal / outlined / text` instead of our `primary / secondary / outlined / tertiary`) — the gap that produced the inventory-drift incident.
- **`<sub>.spec.json` declares visuals** — token bindings for slots, sizes, appearances, states, behavior. This is the visual contract every renderer reads.

**Authoring contract — every new component MUST land all three artefacts in the same PR:**
1. Append an entry to `schema/manifest.json` under `components[]`.
2. Create `schema/components/<family>/<family>.family.json` listing every sub-component.
3. Create `schema/components/<family>/<sub>.spec.json` for each sub-component (mark with `"specMissing": true` in the family root only when intentionally md-only, and only as a temporary state).

A family lacking the family root, or a sub-component lacking its sub-spec, is treated as **not yet in the system** by external consumers — even if the prose `.md` exists. Prose-only components are invisible to renderers.

**Audit checklist** (run before shipping a component change):
- [ ] `manifest.json` lists the family.
- [ ] `<family>.family.json` exists and references every `<sub>.md` in the folder.
- [ ] Every sub-component without `"specMissing": true` has a `<sub>.spec.json` next to its `<sub>.md`.
- [ ] Cross-cutting modifiers mentioned in prose (button's `destructive`, …) are declared on the family root's `axes` — not only in the `.md`.
- [ ] Sub-spec field names referenced in this README's CSS-plumbing note (`spec.sizing.*`, `spec.appearances.*`, etc.) still resolve.

## File layout

```
schema/components/
├── README.md                  ← authoring guide (this file)
├── button/                    ← sub-component family
│   ├── button.family.json         ← family root: lists every sub-component + cross-cutting axes
│   ├── button.md                  ← family authoring page
│   ├── standard.spec.json  ← sub-component visual contract
│   ├── standard.md         (referenced from button.md; see /components/button)
│   ├── fab.spec.json
│   ├── fab.md
│   ├── icon.spec.json
│   ├── icon.md
│   ├── text.spec.json
│   ├── text.md
│   ├── toggle.spec.json
│   ├── toggle.md
│   ├── toolbar.spec.json
│   └── toolbar.md
├── chip/                      ← sub-component family (filter + tag)
├── tabs/                      ← sub-component family (underline + rounded + segmented)
├── form-field/                ← sub-component family (input + search)
├── navigation-bar/            ← sub-component family (home + page)
├── badge/                     ← single-spec family
│   ├── badge.family.json          ← single-entry family root
│   ├── badge.spec.json
│   └── badge.md
├── bottom-sheet/              ← single-spec family
├── callout/                   ← single-spec family
├── channel-list/              ← single-spec family
├── channel-rail/              ← single-spec family
├── dialog/                    ← single-spec family
├── feed/                      ← single-spec family
├── list/                      ← sub-component family (text + radio + thumbnail + nav)
└── thumbnail/                 ← single-spec family
```

The authoritative inventory is `schema/manifest.json` — read it instead of inferring families from the directory listing. The tree above is illustrative; the manifest is the contract.

This folder is the **catalog of record**: any component that exists in the system has a spec here, and any component referenced from `DESIGN.md` defers to its spec rather than re-describing itself. The authoritative list of current families is `schema/manifest.json` (`components[]`) — read it instead of maintaining the inventory by hand here. New families land in the manifest first and propagate into product code and docs from this directory.

One folder per component **family**. The folder is the unit of growth — assets, examples, or sub-component specs that belong to a family live alongside the family's markdown.

### Single-spec vs sub-component families

A family folder always contains a `<family>.md` named after the folder slug. Whether the family also has sub-component specs depends on whether the family expresses one role or several:

- **Single-spec family** (current state of `chip/`) — the family folder contains only `<family>.md`. That file is the full anatomy spec. No sub-pages.
- **Family with sub-components** (current state of `button/`) — the family expresses two or more distinct anchoring roles that share only the Chorus-wide tokens (color, state, focus). The folder contains `<family>.md` plus one `<sub>.md` per sub-component (`fab.md`, `toolbar.md`, `toggle.md`). The family file documents the **standard** form of the component (the default consumers reach for) and links out to the sub-components for the non-standard forms.

Promote a single-spec family to a sub-component family the moment a second role would force the spec to fork its slot vocabulary or sizing ladder. Demote (collapse a sub-component family back to a single spec) only when the second sub-component is removed from the system entirely; a sub-component pruned from product code stays in the spec until it's also pruned from the design contract.

## Authoring pattern

Component specs follow the same writing pattern as `DESIGN.md`:

- **Lead with the one-line role.** What the component is, in one sentence. The reader should know whether to keep reading from the first line.
- **`> Inherits …` callout** as the second line. Names which `DESIGN.md` chapters the spec defers to (color quartets, state overlays, focus ring, etc.). This is the contract that keeps the file scoped to component-specific composition.
- **`## Slots`** — the named regions the component owns (`container`, `label`, `leadingIcon`, …). Bullet list, one line each.
- **`## Anatomy`** — a table mapping slot → tokens for the default variant. When picking which step of `layout.container.*` / `layout.stack.*` / `sys.typo.body.*` to bind, consult [`DESIGN.md` § Composition recipes](../DESIGN.md#composition-recipes) — the five recipes (section-section vertical separation, content-content rhythm, section horizontal padding, body text size, nested container padding) name the canonical step for each compositional situation so the binding doesn't have to be picked from first principles.
- **`## Variants`** (when present) — bullet list of the named variants and how their slot bindings differ from default.
- **`## Sizes`** (when present) — table of size → typography / icon / padding bindings.
- **`## States`** — how hover / focus / pressed / disabled / error / selected behave. Always defers state-overlay and focus-ring details to `DESIGN.md`.
- **`## Behavior`** (when present) — keyboard, focus-trap, dismissal, motion. Anything that is observable but not a token binding.
- **Demo sections** (`## Default`, `## With <slot>`, `## <Variant name>`, `## Full composition`) — one `##` per live example, each wrapping a single `preview/<id>` fence. **Order them as a progression**, not by alphabet or by `## Variants` enumeration:
  1. **`## Default`** (or `## Default (<variant>)` when the default needs disambiguation) — the base form the consumer reaches for first. Always first.
  2. **Composition cases** (`## With flag`, `## With thumbnails`, `## With poll`, …) — one section per *additive slot* the base can take on. Ordered by how often each combination shows up in product surfaces (most common first).
  3. **Variant cases** (`## Radio`, `## Underline`, `## Segmented`, …) — one section per *interaction / appearance variant* the family supports. Ordered to match the `## Variants` bullet list so readers can scan the two in parallel.
  4. **`## Full composition`** — every optional slot present at once. Always last; use only when the family has enough compositional slots to make the all-on case interesting.

  Default first is non-negotiable — it sets the reading anchor for everything below. If a new demo case lands later, slot it into the right band rather than appending to the end.

### Preview widths

The docs preview stage is wider than any single control should naturally be, so the wrapper around each `preview/<id>` fence body is what calibrates the reader's sense of *real* size. Three bands, picked per family:

- **Compact controls** (Button, Chip, Badge, IconButton, FormField, Callout, single List rows, …) — wrap the demo in `<div style={{ width: '100%', maxWidth: 400 }}>`. 400px is the calibration width: it matches a typical mobile column so the control reads at its natural size, and it stops a Standard Button from stretching across the whole stage and reading as a banner.
- **Full-specimen surfaces** (ChannelList, ChannelRail, Feed, NavigationBar, Dialog, BottomSheet, full Tabs row, …) — let the demo flow at the stage's full width (no wrapper, or `width: '100%'` only). These components *are* the page chrome; constraining them to 400px would misrepresent how they read in product.
- **Intrinsic-width specimens** (Thumbnail at a single rung, an Icon grid, a single Avatar) — give them just enough room to render at their native footprint (`<div style={{ width: 200, maxWidth: '100%' }}>` or similar). Don't pad with empty stage.

When in doubt, look at how a sibling family in the same band wrote its wrapper in `apps/docs/components/previews/index.js` and match it. The wrapper is docs chrome — it is *not* part of the spec contract — but the band a component belongs to is a system-wide convention and should not drift across families.

Sections are omitted when the component has nothing to say in them. Tables stay narrow; prose stays at one paragraph per idea; tokens are written in the `<group>.<name>` form (`color.primary`, `layout.container.sm`) so they line up with the docs renderer.

## Consumption

The Chorus docs site renders these specs alongside `DESIGN.md` — the chapter-level scaffolding (Why anatomy, Empty states, Loading) lives in `DESIGN.md`; the per-component anatomy is read from the files in this folder. Other consumers (Figma plugin, AI agent context) read the markdown directly.

### Docs rendering rule

Every markdown file in this folder generates a page under `/components` in the docs site. Family folders may render one or many pages depending on whether they're single-spec or have sub-components:

| File                       | URL                          | Page kind |
|----------------------------|------------------------------|-----------|
| `button/button.md`            | `/components/button`                  | Family page (standard Button spec + sub-component list) |
| `button/fab.md`               | `/components/button/fab`              | Sub-component spec |
| `button/toolbar.md`    | `/components/button/toolbar`   | Sub-component spec |
| `button/toggle.md`     | `/components/button/toggle`    | Sub-component spec |
| `chip/chip.md`                | `/components/chip`                    | Single-spec family |

**Sub-component routing.** When a family folder contains `<family>.md` plus one or more `<sub>.md` files, every `<sub>.md` becomes a page at `/components/<family>/<sub>`, and the side-nav lists those sub-pages collapsed under the family entry. The family page itself renders `<family>.md` verbatim — typically just the cross-family role summary, the `> Inherits` callout, and a markdown sub-component list. The site does not auto-generate a sub-component list on top of the family-page body; the navigation list under the family entry is the docs's nav-chrome version of the same information.

**Single-spec families.** When a family folder contains only `<family>.md`, the family page IS the spec page — no sub-pages exist, and the side-nav does not show an expandable list under the family entry.

The renderer splits each spec into a page header and a body:

- **`#` (h1)** — the file's single top-level heading. Its text becomes the **page title**, and the first paragraph that follows it becomes the **page description** (the recessed band under the title in the docs chrome).
- **`## …` and below** — everything from the first `##` onward (including the `> Inherits …` callout, if it sits before the first `##`) becomes the **page body**. `##` headings render as the page's section anchors; `###` and deeper render as nested headings inside their section.

This keeps the spec readable as a standalone document — the `# Title` works as the document heading when read on GitHub or in an editor — while letting the docs hoist that title into the page chrome and start the body at `##`.

Authoring contract (so the renderer never has to guess):

- **Exactly one `# Title`**, on the first non-blank line of the file.
- **Exactly one description paragraph** between the `#` and the first `##` / `>` block. Keep it to one paragraph — multiple paragraphs there will all collapse into the page description.
- **`> Inherits …` callout** comes after the description, before the first `##`. The renderer styles it as the page's intro callout, so don't reuse `>` for general quoting inside the body.
- **No `# ` other than the title.** Use `##` and below for everything in the body.

The chapter-level scaffolding (`Why anatomy, not a catalogue`, `Empty states`, `Loading & Skeleton states`) stays in `DESIGN.md` and renders on the `/components` index page — the Components group landing in the side-nav links there directly. There is no separate "Overview" sub-route under Components.

## Worked example: building Badge from scratch

This walkthrough shows every file an implementer touches when adding a new component, using the existing `Badge` as the worked example. A fresh agent should be able to add an analogous single-spec family by following the same five-file shape — and a sub-component family by repeating step 3 (a `<sub>.spec.json` per sub-component) and listing all of them in the family root.

**1. `schema/manifest.json`** — append the family. The manifest is the system inventory; nothing else discovers the family until this entry exists.

```json
{ "family": "badge", "root": "components/badge/badge.family.json" }
```

**2. `schema/components/badge/badge.family.json`** — declare the family root. Single-spec families list one sub-component whose slug equals the family slug; sub-component families list every form and mark exactly one with `"default": true`. Cross-cutting modifiers that span sub-components go on the root's `axes` (see `button.family.json`'s `flavor: ["default", "destructive"]` for the pattern).

```json
{
  "$schema": "../../family.schema.json",
  "family": "badge",
  "name": "Badge",
  "description": "Numeric count indicator. …",
  "spec": "badge.md",
  "subcomponents": [
    { "slug": "badge", "spec": "badge.spec.json", "md": "badge.md", "default": true }
  ]
}
```

**3. `schema/components/badge/badge.spec.json`** — declare the visual contract. Every binding here is a token reference (`sys.*` / `ref.*`), never a literal. Pick the right axis fields:
- `appearance` (single) vs `appearances` (multi) vs `selectionStates` (toggle pairs) — mutually exclusive.
- `sizing` (single rung) vs `sizes` (multi-rung axis) — mutually exclusive.

```json
{
  "$schema": "../../spec.schema.json",
  "name": "Badge",
  "family": "badge",
  "description": "Numeric count indicator. …",
  "element": "span",
  "props": { "size": { "type": "literal", "values": ["medium", "small"], "default": "medium" }, … },
  "slots": { "label": { "required": true, "description": "Short single-line label …" } },
  "appearance": {
    "background": "sys.color.brand",
    "label":      "sys.color.onBrand",
    "radius":     "sys.radius.full"
  },
  "sizes": {
    "medium": { "minHeight": "ref.space.250", "paddingInline": "ref.space.75",  "labelTypo": "sys.typo.label.sm" },
    "small":  { "minHeight": "ref.space.200", "paddingInline": "sys.layout.container.2xs", "labelTypo": "sys.typo.caption.sm" }
  }
}
```

**4. `schema/components/badge/badge.md`** — write the prose contract. `# Title` (page title) → one-paragraph description → `> Inherits …` callout → `## Slots` → `## Anatomy` (the table whose values match the spec.json) → axis sections → `## States` → `## Behavior` → demo sections (`## Default`, then composition, then variants, then `## Full composition`). Numbers in parentheses in the Anatomy table are reading aids; the token name is the contract.

**5. `packages/ui/src/Badge.jsx`** — the React file reads the spec at module scope and emits inline `--badge-*` plumbing vars at render time. Use `tokenToCss` / `typoStyles` from `spec-utils.js`; do not duplicate the `var(--…)` formatting by hand.

```jsx
import badgeSpec from '../../../schema/components/badge/badge.spec.json';
import { tokenToCss, typoStyles, joinClasses } from './spec-utils.js';

function sizingStyle(spec, size) {
  const s = spec.sizes[size] ?? spec.sizes.medium;
  return {
    '--badge-min-height':    tokenToCss(s.minHeight),
    '--badge-padding-block': tokenToCss(s.paddingBlock),
    '--badge-padding-inline':tokenToCss(s.paddingInline),
    ...typoStyles(s.labelTypo),
  };
}
function appearanceStyle(spec) {
  return {
    '--badge-bg':     tokenToCss(spec.appearance.background),
    '--badge-label':  tokenToCss(spec.appearance.label),
    '--badge-radius': tokenToCss(spec.appearance.radius),
  };
}

export function Badge({ size = 'medium', children, className, style, ...rest }) {
  return (
    <span
      className={joinClasses('chorus-badge', `chorus-badge--${size}`, className)}
      style={{ ...sizingStyle(badgeSpec, size), ...appearanceStyle(badgeSpec), ...style }}
      {...rest}
    >{children}</span>
  );
}
```

**6. `packages/ui/src/styles.css`** — one selector per element, consuming the `--badge-*` vars only. No literal lengths or colours, no `var(--sys-…)` called directly from a component rule (the indirection through `--badge-*` is the contract — it lets a per-variant / per-state class change one var without restating the binding). Per the [no-layout strokes rule](../DESIGN.md#strokes-borders-without-layout), if Badge ever grows a stroke or focus ring it draws as `box-shadow: inset …` (stroke) or `::after { position: absolute; … }` (focus ring), never as a `border:` or `outline:` that would reflow callers.

```css
.chorus-badge {
  display: inline-flex; align-items: center; justify-content: center;
  box-sizing: border-box;
  min-height: var(--badge-min-height);
  padding:    var(--badge-padding-block) var(--badge-padding-inline);
  border-radius: var(--badge-radius);
  background: var(--badge-bg);
  color:      var(--badge-label);
}
```

**7. `packages/ui/src/index.js`** — re-export the new component so consumers can `import { Badge } from '@blind-chorus/ui'`.

**8. `apps/docs/components/previews/index.js`** — register one entry per `preview/<id>` fence the .md uses, and wrap each in the right [preview-width band](#preview-widths). Badge is a compact control, so:

```jsx
'preview/badge-default': () => (
  <div style={{ width: '100%', maxWidth: 400 }}>
    <Badge count={3} />
  </div>
),
```

**9. Run the audit checklist** (see *Machine-readable contract* above) and verify the page renders at `/components/badge` in `npm run dev`. The component is shippable when the manifest, family root, sub-spec, prose md, JSX, CSS, export, and preview entries all line up — and the prose binding table values match the `.spec.json` token references one-for-one.

The same nine-step shape applies to a sub-component family (e.g. adding a new Chip variant): step 2 already exists, step 3 is repeated per new sub-component, the `<family>.md` lists the new sub in its sub-component table, and the JSX usually delegates to a shared internal renderer rather than a wholly new file.
