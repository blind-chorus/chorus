# @blind-dsai/components

Per-component specifications. One folder per family; one `.md` per family or sub-component holding slots, bindings, variants, states, behavior.

## Relationship to `DESIGN.md`

[`schema/DESIGN.md`](../DESIGN.md) owns every cross-cutting rule — token architecture, color quartets, typography, spacing, elevation, state overlays, focus ring composition, accessibility floor, voice. Component specs **never restate** those rules; they document only component-specific composition. Do not add per-spec "see DESIGN.md" callouts — the deferral is implicit and global.

## Spec is the source of truth

**The `<family>.md` (or `<family>/<sub>.md`) file is the contract.** Product code, docs preview, and live JSX in `apps/docs/components/previews/index.js` all consume it; none mint new rules.

- **Read the spec first.** Slot list, Anatomy table, Sizes, States, Behavior. Anatomy token names are the values; parenthesized numbers are reading aids.
- **Binding table is exhaustive.** If a slot's padding/gap/typo/color/radius/border isn't listed, it inherits from `DESIGN.md` defaults — not from the preview.
- **Preview is derived.** `previews/index.js` maps a fence id to live JSX. Only the fence body is canonical (import + props shape are part of the spec); surrounding visual wrappers (width caps, demo state) are docs chrome.
- **Detail changes round-trip through the spec.** Update spec md first → CSS/JSX → verify preview. If a change starts in CSS, the spec edit is still required before shipping.

Shorthand: **if the spec doesn't say it, it isn't true yet.**

### How the CSS receives bindings (`--<component>-*` plumbing vars)

`packages/ui/src/styles.css` is plain static CSS — it can't read `.spec.json`. Each component selector consumes *local* custom properties named `--<component>-*` (`--button-standard-gap`, `--chip-padding-inline`, …). **These are not design tokens** and never appear in `schema/tokens/*.json`; they are indirection plumbing.

The React file reads the spec's binding (`spec.sizing.gap === "sys.layout.inline.md"`) and emits it inline at render time — `style={{ '--button-standard-gap': 'var(--sys-layout-inline-md)' }}` — and the stylesheet says `gap: var(--button-standard-gap)`.

So: the *token* (`sys.*`/`ref.*`) lives in `schema/tokens/*.json` and is named in the Anatomy table; the *binding* lives in `.spec.json`; the `--<component>-*` var is a renamed pointer the CSS uses to receive it. The extra hop keeps bindings in the `.spec.json` (the contract every consumer reads) and lets per-variant/per-state values set the var once via class/pseudo-class rules.

**No `comp.*` token tier is in use** — reserved but empty. If a binding needs something `sys.*` can't express: spec md → add `comp.*` to `schema/tokens/*.json` → reference `var(--comp-…)` in CSS/JSX. (Fuller note at the top of `packages/ui/src/styles.css`.)

## Machine-readable contract

The prose `.md` files are the **authoring** contract. Alongside them sits a **machine-readable** layer external consumers (Claude Design, AI agents, design-tool plugins, downstream renderers) read instead of crawling prose:

```
schema/
├── manifest.json           ← system inventory. **External tools start here.**
├── family.schema.json      ← JSON Schema for a family root (`<family>.family.json`).
├── spec.schema.json        ← JSON Schema for a sub-component spec (`<sub>.spec.json`).
└── components/<family>/
    ├── <family>.family.json    ← family root: names family, lists subs, declares cross-cutting axes.
    ├── <family>.md             ← family authoring page (prose).
    ├── <sub>.spec.json         ← sub-component visual contract (props, slots, sizing, appearance, states).
    └── <sub>.md                ← sub-component authoring page (prose).
```

Two contracts:
- **`<family>.family.json` declares structure** — what subs exist, what axes the family owns, where prose lives. Without it, tools fall back to their own taxonomy (Material's `filled/tonal/outlined/text` instead of our `primary/secondary/outlined/tertiary`) — the inventory-drift gap.
- **`<sub>.spec.json` declares visuals** — token bindings for slots, sizes, appearances, states, behavior.

**Authoring contract — every new component lands all three artefacts in the same PR:**
1. Append entry to `schema/manifest.json` under `components[]`.
2. Create `schema/components/<family>/<family>.family.json` listing every sub-component.
3. Create `schema/components/<family>/<sub>.spec.json` for each sub (mark `"specMissing": true` in the family root only as a temporary md-only state).

A family lacking the family root, or a sub lacking its sub-spec, is **not yet in the system** for external consumers — even if prose `.md` exists. Prose-only components are invisible to renderers.

**Audit checklist** (before shipping):
- [ ] `manifest.json` lists the family.
- [ ] `<family>.family.json` exists and references every `<sub>.md` in the folder.
- [ ] Every sub without `"specMissing": true` has a `<sub>.spec.json` next to its `<sub>.md`.
- [ ] Cross-cutting modifiers mentioned in prose (button's `destructive`, …) are declared on the family root's `axes`.
- [ ] Sub-spec field names referenced in the CSS-plumbing note (`spec.sizing.*`, `spec.appearances.*`, etc.) still resolve.

## File layout

```
schema/components/
├── README.md                  ← authoring guide (this file)
├── button/                    ← sub-component family
│   ├── button.family.json
│   ├── button.md
│   ├── standard.spec.json
│   ├── standard.md
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
│   ├── badge.family.json
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

Authoritative inventory: `schema/manifest.json`. Read it instead of inferring from the tree above (illustrative). This folder is the **catalog of record** — any component in the system has a spec here; anything referenced from `DESIGN.md` defers to its spec. New families land in the manifest first.

One folder per **family**. The folder is the unit of growth — assets, examples, or sub-specs live alongside the family's markdown.

### Single-spec vs sub-component families

Every family folder contains `<family>.md` named after the folder slug.

- **Single-spec family** (e.g. `chip/`) — folder contains only `<family>.md`. That file is the full spec. No sub-pages.
- **Sub-component family** (e.g. `button/`) — family expresses two or more distinct anchoring roles sharing only Chorus-wide tokens. Folder contains `<family>.md` + one `<sub>.md` per sub. The family file documents the **standard** form and links out to subs for non-standard forms.

Promote single-spec → sub-component when a second role forces forking slot vocabulary or sizing. Demote only when the second sub is removed from the system entirely; a sub pruned from product code stays in the spec until pruned from the design contract.

## Authoring pattern

Specs follow `DESIGN.md`'s writing pattern:

- **Lead with the one-line role.** First sentence tells the reader whether to keep reading.
- **No leading `>` callout.** Deferral to `DESIGN.md` is global; do not restate per-file. First element after the description paragraph is the first `##` heading.
- **`## Slots`** — named regions (`container`, `label`, `leadingIcon`, …). Bullet list, one line each.
- **`## Anatomy`** — table mapping slot → tokens for the default variant. When choosing a step of `layout.container.*` / `layout.stack.*` / `sys.typo.body.*`, consult [`DESIGN.md` § Composition recipes](../DESIGN.md#composition-recipes) — the five recipes name the canonical step.
- **`## Variants`** (when present) — bullet list; how each variant's bindings differ from default.
- **`## Sizes`** (when present) — table of size → typo/icon/padding bindings.
- **`## States`** — hover/focus/pressed/disabled/error/selected behavior. Defers state-overlay and focus-ring details to `DESIGN.md`.
- **`## Behavior`** (when present) — keyboard, focus-trap, dismissal, motion. Observable but not a token binding.
- **Demo sections** (`## Default`, `## With <slot>`, `## <Variant name>`, `## Full composition`) — one `##` per live example, each wrapping a single `preview/<id>` fence. **Ordered as a progression:**
  1. **`## Default`** (or `## Default (<variant>)`) — base form. Always first.
  2. **Composition cases** (`## With flag`, `## With thumbnails`, …) — one per *additive slot*. Order by frequency in product surfaces.
  3. **Variant cases** (`## Radio`, `## Underline`, …) — one per *interaction/appearance variant*. Order matches the `## Variants` bullet list.
  4. **`## Full composition`** — every optional slot present. Always last; only when the family has enough slots to make all-on interesting.

  Default first is non-negotiable. New demos slot into the right band rather than appending to the end.

### Preview widths

The docs stage is wider than any single control. Three bands, picked per family:

- **Compact controls** (Button, Chip, Badge, IconButton, FormField, Callout, single List rows, …) — wrap in `<div style={{ width: '100%', maxWidth: 400 }}>`. 400px matches a typical mobile column.
- **Full-specimen surfaces** (ChannelList, ChannelRail, Feed, NavigationBar, Dialog, BottomSheet, full Tabs row, …) — flow at stage's full width (no wrapper, or `width: '100%'`). These *are* page chrome.
- **Intrinsic-width specimens** (Thumbnail at a single rung, an Icon grid, single Avatar) — just enough to render at native footprint (`<div style={{ width: 200, maxWidth: '100%' }}>`).

When in doubt, match a sibling family's wrapper in `apps/docs/components/previews/index.js`. The wrapper is docs chrome (not the spec contract); the band is a system-wide convention.

Omit sections when the component has nothing to say. Tables narrow; prose one paragraph per idea; tokens written `<group>.<name>` (`color.primary`, `layout.container.sm`).

## Consumption

The docs site renders specs alongside `DESIGN.md` — chapter scaffolding (Why anatomy, Empty states, Loading) lives in `DESIGN.md`; per-component anatomy is read from this folder. Other consumers (AI agents, design-tool plugins) read the markdown directly.

### Docs rendering rule

Every markdown file generates a page under `/components`. Family folders render one or many pages:

| File                       | URL                          | Page kind |
|----------------------------|------------------------------|-----------|
| `button/button.md`         | `/components/button`         | Family page (standard Button spec + sub list) |
| `button/fab.md`            | `/components/button/fab`     | Sub-component spec |
| `button/toolbar.md`        | `/components/button/toolbar` | Sub-component spec |
| `button/toggle.md`         | `/components/button/toggle`  | Sub-component spec |
| `chip/chip.md`             | `/components/chip`           | Single-spec family |

**Sub-component routing.** When a family folder contains `<family>.md` + `<sub>.md` files, each `<sub>.md` becomes a page at `/components/<family>/<sub>`; the side-nav lists subs collapsed under the family. The family page renders `<family>.md` verbatim. The site does not auto-generate a sub list on top of the family-page body; the nav list is the nav-chrome version.

**Single-spec families.** Folder contains only `<family>.md` — family page IS the spec; no sub-pages; side-nav shows no expandable list.

The renderer splits each spec into header and body:

- **`#` (h1)** — single top-level heading. Text becomes **page title**; first paragraph after it becomes **page description**.
- **`## …` and below** — everything from the first `##` becomes the **page body**. `##` render as section anchors; `###`+ render nested.

Authoring contract:

- **Exactly one `# Title`**, on the first non-blank line.
- **Exactly one description paragraph** between `#` and the first `##`. Multiple paragraphs collapse.
- **No leading `>` callout.** Deferral to `DESIGN.md` is global.
- **No `# ` other than the title.** Use `##` and below for the body.

Chapter scaffolding (`Why anatomy, not a catalogue`, `Empty states`, `Loading & Skeleton states`) stays in `DESIGN.md` and renders on `/components` — the Components group landing in the side-nav links there directly. No separate "Overview" sub-route.

### Token chip prefix trimming

The docs renderer strips the longest common dot-bounded namespace prefix off token chips inside any scoped table or section. Markdown source and JSX call sites carry the canonical full name (`sys.color.primary`, `$sys.state.hover`); the chip displays the trimmed tail (`primary`, `$hover`).

The shared mechanism lives at [`apps/docs/components/TokenTrim.jsx`](../../apps/docs/components/TokenTrim.jsx):

- **Component spec tables** (rendered from markdown by `ComponentMd`) — trimming is automatic. The renderer walks the table AST and composes a column-level + cell-level scope map.
- **Foundation & guideline tables** (rendered as JSX by `sections.jsx`) — each `RoleTable` / `EqualTable` accepts a `tokens` prop holding the explicit list of token names rendered inside it. The renderer wraps the table in a `TokenTrimScope` that builds the trim map.

Trimming activates when **every** token in scope (a) matches `^\$?(sys|ref|comp)\.[\w.]+$`, (b) shares the same first segment (no `sys.* + ref.*` mix), and (c) the longest common dot prefix leaves at least one segment as display. The optional leading `$` is preserved on display.

| Source                                              | Display                  |
|-----------------------------------------------------|--------------------------|
| `sys.color.primary` (column all `sys.color.*`)      | `primary`                |
| `$sys.state.hover` (column all `$sys.state.*`)      | `$hover`                 |
| `sys.layout.container.xs` × `sys.layout.container.md` (in one cell) | `xs` × `md` |
| `sys.color.primary` + `transparent` in same column  | `primary` + `transparent` (literals stay) |
| `sys.color.primary` + `ref.palette.blue.500` (cross-tier) | both kept full     |

Click-to-copy still writes the **full** name to the clipboard (the chip carries `data-token`; `TokenChipCopy` reads it before falling back to `textContent`). Tooltip shows the full name on hover. Inline prose token chips outside any scope are never trimmed — a single mention carries the prefix as information. Author tables with full token names; do not pre-strip in the source — that breaks the contract every other consumer reads.

## Worked example: building Badge from scratch

Every file an implementer touches when adding a new component. A fresh agent should be able to add an analogous single-spec family by following this five-file shape — and a sub-component family by repeating step 3 (a `<sub>.spec.json` per sub) and listing all in the family root.

**1. `schema/manifest.json`** — append the family. Nothing discovers the family until this entry exists.

```json
{ "family": "badge", "root": "components/badge/badge.family.json" }
```

**2. `schema/components/badge/badge.family.json`** — declare the family root. Single-spec families list one sub whose slug equals the family slug; sub-component families list every form and mark exactly one `"default": true`. Cross-cutting modifiers go on the root's `axes` (see `button.family.json`'s `flavor: ["default", "destructive"]`).

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

**3. `schema/components/badge/badge.spec.json`** — declare the visual contract. Every binding is a token reference (`sys.*`/`ref.*`), never a literal. Mutually exclusive axis fields:
- `appearance` (single) vs `appearances` (multi) vs `selectionStates` (toggle pairs).
- `sizing` (single rung) vs `sizes` (multi-rung axis).

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

**4. `schema/components/badge/badge.md`** — prose contract. `# Title` → one-paragraph description → `## Slots` → `## Anatomy` (values match the spec.json) → axis sections → `## States` → `## Behavior` → demo sections (`## Default`, composition, variants, `## Full composition`). Numbers in the Anatomy table are reading aids; the token name is the contract.

**5. `packages/ui/src/Badge.jsx`** — React reads the spec at module scope and emits inline `--badge-*` vars at render. Use `tokenToCss` / `typoStyles` from `spec-utils.js`; do not duplicate `var(--…)` by hand.

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

**6. `packages/ui/src/styles.css`** — one selector per element, consuming `--badge-*` only. No literal lengths/colours, no `var(--sys-…)` called directly from a component rule (indirection through `--badge-*` is the contract — per-variant/per-state classes change one var without restating the binding). Per the [no-layout strokes rule](../DESIGN.md#strokes-borders-without-layout), strokes draw as `box-shadow: inset …`, focus rings as `::after { position: absolute; … }`, never `border:`/`outline:`.

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

**7. `packages/ui/src/index.js`** — re-export so consumers can `import { Badge } from '@blind-dsai/ui'`.

**8. `apps/docs/components/previews/index.js`** — register one entry per `preview/<id>` fence and wrap in the right [preview-width band](#preview-widths). Badge is compact:

```jsx
'preview/badge-default': () => (
  <div style={{ width: '100%', maxWidth: 400 }}>
    <Badge count={3} />
  </div>
),
```

**9. Run the audit checklist** (above) and verify the page renders at `/components/badge` in `npm run dev`. Shippable when manifest, family root, sub-spec, prose md, JSX, CSS, export, and preview entries align — and prose binding table values match `.spec.json` token references one-for-one.

The same nine-step shape applies to sub-component families (e.g. a new Chip variant): step 2 already exists, step 3 repeats per new sub, the `<family>.md` lists the new sub in its sub-component table, and JSX usually delegates to a shared internal renderer.
