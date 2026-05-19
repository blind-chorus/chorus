# Docs

> A rendered view of [`DESIGN.md`](../../schema/DESIGN.md) and [`schema/components/*/*.md`](../../schema/components) — token values, group structures, theme/responsive variants, and per-component anatomies made browsable.

[`DESIGN.md`](../../schema/DESIGN.md) is the upstream, canonical document for the system as a whole; per-component anatomy (slots, default bindings, variants, sizes, states, behavior) lives in [`schema/components/<slug>/<slug>.md`](../../schema/components) under the contract documented in [`schema/components/README.md`](../../schema/components/README.md). Together they are **the source of truth for the system's *meaning***. This site exists only to *summarize and visualize* that content — token values shown as live chips and tables, group structures rendered in browsable form, theme and responsive variants made interactive, component specs hoisted into per-component pages. If the site and the upstream specs ever disagree, **the specs win**; the site is downstream and must be updated to match.

This README only covers what is specific to *building and running the docs site*. Anything about *what the system means* belongs in [`DESIGN.md`](../../schema/DESIGN.md) or in the matching per-component `.md`.

## Source-of-truth rule (no docs-authored content)

The site does not author its own prose. Every word a user reads in the docs body must come from one of two upstream sources:

- **`DESIGN.md`** — token architecture, color, typography, spacing, elevation, state overlays, focus ring, accessibility, voice, and the Components-chapter scaffolding (Why anatomy, Empty states, Loading & Skeleton states).
- **`schema/components/<slug>/<slug>.md`** — slots, default bindings, variants, sizes, states, behavior for each component.

The two narrow exceptions:

1. **Visual specimens** — token swatches, type ladders, elevation chips, state-layer demos, palette grids. The site *renders the token's value*; it does not restate the token's meaning. Any prose label inside a specimen must be a verbatim subset of the upstream definition.
2. **Navigation chrome** — side-nav labels, in-page TOC labels, the components directory list at `/components`. These are docs UX, not Chorus content. Keep them short and route-shaped; if a label needs more than a few words to make sense, the missing prose belongs in the upstream spec, not in the navigation.

When you spot a `<Section>` or `<ProseSection>` in [`apps/docs/components/sections.jsx`](components/sections.jsx) that authors prose duplicating either upstream source, refactor it: extract the section from the upstream `.md` (use `extractDesignSection` from [`lib/componentMd.js`](lib/componentMd.js) for `DESIGN.md`, or `parseComponentMd` for per-component specs) and feed the body through the markdown renderer. Hardcoded JSX prose is treated as a bug against this contract.

## Rendering DESIGN.md

The site mirrors `DESIGN.md`'s structure mechanically. Five contracts govern how source becomes pixels — the IA mapping, the typography-per-heading rule, the markdown-primitive rule, the prose-excerpt rule, and the re-validation rule.

### IA mapping (heading → Docs surface)

Each `DESIGN.md` heading depth lands in a fixed docs surface and renders as a fixed HTML element. Page-content prose mirrors a markdown render — bare `<h2>` / `<h3>` / `<p>` with no semantic class on the element itself.

| DESIGN.md heading | Docs surface | Element |
|---|---|---|
| `##` | Side-nav **group label** (대분류). The `##` text is the group name. | `<a>` · `.side-nav-link-top` (or `.side-nav-group-title` when expanded) |
| `###` (when `##` has `###` children) | A **page** under that group (중분류). The `###` text *is* the page-title — set verbatim as `header.title` in the route's `page.jsx`. The leading paragraph under the heading becomes the page-header description (`header.description`). | `<h1>` · `.page-header-title` + `<p>` · `.page-header-desc` |
| `##` (when it has no `###` children) | A **single page** that *is* the umbrella. The `##` text is both the group label and the page-title; the leading paragraph under `##` becomes the description. | `<h1>` · `.page-header-title` + `<p>` · `.page-header-desc` |
| `####` | A **subsection** inside the page. Listed in the right-hand page-nav TOC. | `<h2 id="...">` (bare — typography from `.page-content h2`) |
| `#####` | A **prose sub-heading** inside a `####` subsection (e.g. *Role structure*, *How to apply*). | `<h3>` (bare — typography from `.page-content h3`) |
| Leading paragraph under a `####` / `#####` | Section description / sub-heading lead-in. | `<p>` (bare — typography from `.page-content > p`) |

**Page-title contract (`###`).** Whenever a `### Foo` exists in `DESIGN.md` and a route renders Foo, the route's `header.title` must be `"Foo"` and `header.description` must be the leading paragraph from `DESIGN.md` under that heading. If the upstream heading or summary changes, the route's `page.jsx` updates next.

**Single-`###` umbrella collapses in nav.** When a `##` umbrella has exactly one `###` child, the side-nav hides the sub-list and shows the `##` label as the link itself (linking to the single child's route). The page-title still comes from `###` — so the side-nav and the page header can read differently on purpose.

> Example: `## Introduction > ### Chorus` renders as side-nav "Introduction" (one click target, no expanded list) → page-title "Chorus" with the `### Chorus` description. Same for `## Patterns > ### Responsive behavior`: side-nav "Patterns", page-title "Responsive behavior".

**Page-title inherits from `##` when no `###` exists.** A `##` umbrella with zero `###` children is the page itself — page-title and side-nav both read the `##` text, and the page-header description is the leading paragraph under `##`. (No section in `DESIGN.md` is currently shaped this way; every `##` has at least one `###` child.)

**Components chapter is split between two upstream sources.** The IA mapping above governs the *shape* of the chapter, but the *body* comes from a second source for family and sub-component pages:

| Route | Body source |
|---|---|
| `/components` (chapter landing) | `DESIGN.md` `### Why anatomy …` + `### Empty states` + `### Loading & Skeleton states`, extracted by [`extractDesignSection`](lib/componentMd.js) and rendered through [`<DesignSection>`](components/DesignSection.jsx). The component directory list (links to each family / sub-component page) is the only docs-authored block on the page — pure navigation. |
| `/components/<family>` (one per family folder) | [`schema/components/<family>/<family>.md`](../../schema/components), parsed by [`parseComponentMd`](lib/componentMd.js) — the file's `# Title` becomes the page header, the leading paragraph becomes the description, and everything from the `>` callout / first `##` onward feeds [`<ComponentMd>`](components/ComponentMd.jsx). For families with sub-components this body is short — a cross-family role summary, the `> Inherits` callout, and a markdown sub-component list. For single-spec families it is the full anatomy. |
| `/components/<family>/<sub>` (one per sub-component md, when present) | [`schema/components/<family>/<sub>.md`](../../schema/components), parsed the same way as a family file. Only emitted when the family folder contains `<sub>.md` files in addition to `<family>.md`; absent for single-spec families. |

`DESIGN.md`'s `### Button / Input / Card / Dialog / Chip / Tab bar / Form patterns` are intentional **stubs** — a one-line family role + a link to the full anatomy in `schema/components/`. Don't promote those stubs into full pages here; the per-family / per-sub-component routes already render the canonical body.

**Components chapter landing collapses to the chapter's `##` umbrella.** The Components group label in the side-nav links to `/components` directly — there is no separate "Overview" sub-route. Every family entry under it (`Button`, `Chip`, …) is its own side-nav item, and a family with sub-components expands to list its `<family>/<sub>` pages.

**Single-sub-component family collapses to the family page.** When a family folder contains `<family>.md` plus exactly one `<sub>.md`, the renderer treats the sub-component spec as the family's anatomy and does not emit a separate `/components/<family>/<sub>` route. The side-nav shows the family entry as a single link target, the page header reads the family title, and the body renders the lone `<sub>.md` content under it. (This mirrors the "Single-`###` umbrella collapses in nav" rule from the IA mapping above — a family with one sub-component is the same shape as a `##` umbrella with one `###` child.) The collapse reverses automatically the moment a second `<sub>.md` is added to the folder.

### Typography contract (heading → Element)

**One heading level → one HTML element.** A `####` always renders as `<h2>`; a `#####` always renders as `<h3>`. **Never render the same level at two different sizes** — e.g. two `#####` blocks must not produce one `label-lg` heading on one page and a `body-md` heading on another. Typography is owned by tag selectors under `.page-content` (which read from `sys.typo.*`); pages never apply font classes to headings or paragraphs inline.

**Manual exceptions compose on the modifier, never on typography.** When a specific surface needs an extra affordance (do/don't column titles, a colored variant, a tighter grid slot), the heading is still a bare `<h3>` — the modifier class handles layout / color / iconography only. Example: `<h3 class="guidelines-col-title guidelines-col--do">…</h3>` adds the icon row + accent color, but typography still comes from `.page-content h3`.

### Markdown primitive contract

The same single-style rule that governs headings governs every other markdown construct. Each primitive resolves to a single canonical docs style — never two visual variants of the same thing.

| DESIGN.md primitive | Canonical docs style |
|---|---|
| Markdown table | `<div>` · `.sem-table` rendered via one of three variants — `role-table` (token + role stacked, value as inline meta), `equal-cols` (N equal columns with a visible head, e.g. need / token / value), or the default 3-col layout for chip-bearing tables. Never a raw `<table>`, never a bespoke grid. Values come from [`schema/tokens`](../../schema/tokens) where applicable; static reference tables (responsive step-up, agent quick reference) re-author the same data in JSX. |
| Unordered list (`-` / `*`) | `<ul>` · `.rule-list` as a direct child of `.page-content`. |
| Ordered list (`1.` / `2.`) | `<ol>` · `.rule-list` as a direct child of `.page-content`. The numbering style (decimal, indent, marker color) is owned by `.rule-list` — pages never restyle list markers. |
| Inline `code` | Bare `<code>`. The chip styling (background, padding, monospace) comes from tag-scoped selectors (`.page-content > p code`, `.rule-list li code`, `.guidelines-item code`); explicit token chips in tables use the `<TokenChip>` component which renders a `<span class="token-chip">`. |
| **Strong** / *emphasis* | `<strong>` / `<em>`, no extra class — typography stays inherited from the surrounding block. |

Two tables on different pages must read as the same table style; two ordered lists must use the same indent and marker. If a primitive truly needs a second style, name and document the new variant once, then reuse it everywhere it applies — don't author it inline on a single page.

### Heading casing (segmented sentence case)

Headings, page titles, and side-nav labels follow the **segmented sentence case** rule from [`DESIGN.md` § Casing](../../schema/DESIGN.md#casing): each segment delimited by a major separator (`&`, `/`, `·`, `×`, `:`, `→`) is sentence-cased independently. Examples used by this site: *Spacing & Layout*, *State layers & Focus*, *Visual theme & Atmosphere*, *Tracking & Line-height principles*, *Categories × Sizes*, *Do's & Don'ts*. Hyphenated compounds (`line-height`) stay one word. When a `DESIGN.md` heading is updated for casing, its mirror in [`lib/nav.js`](lib/nav.js), the route's `header.title`, and any inline `<Section title>` must update in the same PR.

### Prose excerpting (verbatim subset)

Prose rendered in the docs must be a verbatim *subset* of the corresponding `DESIGN.md` passage — same words, same order, same structural slot (intro paragraph stays in the page-header description, role-structure bullets stay under the role-structure heading, "How to apply" steps stay under that heading, and so on). Dropping sentences for brevity is allowed. **Combining sentences from different `DESIGN.md` blocks into one, paraphrasing for flow, or inventing connective summary text is not.** If two `DESIGN.md` statements need to appear together in the docs, render them in their original separate slots — do not weld them into a single sentence.

### Re-validation when sources change

`DESIGN.md` and this README are the upstream specs; the docs site is downstream and must follow.

- **When `DESIGN.md` changes** — re-walk every affected route in this app. Heading text, leading paragraphs, table rows, list items, and any primitive listed in the contracts above must match the new source. New `##` / `###` headings need a nav entry and a page; removed headings need their route deleted. Same-PR responsibility — don't ship a `DESIGN.md` change without the docs patch.
- **When this README changes** — re-walk the docs against the revised contract. If a rule tightens (e.g. a new canonical style for a primitive, a new heading-to-element binding), audit existing pages for violations and bring them into compliance in the same PR.
- **Drift is a bug.** Out-of-sync docs are treated as bugs against this README, not as follow-up work. Open an issue or fix on the spot — don't let the site and the spec disagree.

## Adding a new section

1. Add the heading in [`DESIGN.md`](../../schema/DESIGN.md) first, at the right depth.
2. Add the matching component in [`apps/docs/components/sections.jsx`](components/sections.jsx), following the heading + primitive contracts above.
3. For a new `###` page, add a route under [`apps/docs/app/(site)/`](app/(site)) with a `RouteShell` whose `header.title` / `header.description` mirror the upstream `###` heading and its leading paragraph verbatim.
4. Wire the route into [`apps/docs/lib/nav.js`](lib/nav.js). Page titles, descriptions, and subsection IDs stay textually consistent with the upstream `DESIGN.md` headings. Every route renders a right-hand page-nav (TOC): a static route declares its `toc:` entries in `nav.js`; a route whose headings come from a markdown source instead derives them at render time and passes them to `RouteShell` via the `toc` prop (see `app/(site)/components/[slug]/page.jsx`). Routes without a TOC are an inconsistency, not a feature.

## Token rules

### Token-first

The site must consume tokens from [`@blind-dsai/tokens`](../../schema/tokens) as its single source of truth. No raw pixel, hex, or unitless literals inline; no branching on `data-theme` or media queries with hardcoded values — rely on each token's `$theme` and `$responsive` variants instead.

Reference palette tokens (`palette.*`) appear only inside the Color Palette documentation section. Everywhere else, components consume system tokens (`color.*`, `layout.*`, …), per the reference→system rule in [`DESIGN.md`](../../schema/DESIGN.md#token-architecture).

If a needed value does not yet exist as a token, document its role in [`DESIGN.md`](../../schema/DESIGN.md) first, then add the JSON value to `schema/tokens`. Undocumented tokens are tokens without intent.

### Where token descriptions come from

The dependency direction is fixed: **[`DESIGN.md`](../../schema/DESIGN.md) → `schema/tokens/*.json` → this site**. `DESIGN.md` defines what every token *means*, the JSON files hold its *values* only (no `$description` / `$summary` fields), and the site renders those values back in a browsable form. Meaning never originates in the site or in JSON — it only originates in `DESIGN.md`.

The site currently displays token tables with values and visual chips. Token *descriptions* in the table cells are not yet wired up to `DESIGN.md`; the sync mechanism (build-time extraction from `DESIGN.md` tables, MDX import, or another approach) is a follow-up step. Until then, click a token name in the docs to read its full description in `DESIGN.md` — the upstream source.

## Spacing axes in this site

Chorus defines four semantic spacing axes under `sys.layout.*` in [`schema/tokens/system.json`](../../schema/tokens/system.json) (rationale: [`DESIGN.md`](../../schema/DESIGN.md#spacing--layout)). Concretely, this site applies them as follows:

| Axis | Scope | Question it answers | Owner |
|---|---|---|---|
| `layout.page.*`      | Viewport ↔ content | How far should any content stay from the edge of the screen? | Page shell / root layout (applied **once** per route) |
| `layout.container.*` | Surface ↔ its content | How much breathing room does this card / sheet / dialog give its own content? | The individual surface |
| `layout.stack.*`     | Sibling ↔ sibling (vertical) | How much vertical gap between these two elements in a column? | The parent (via flex/grid `gap`, an owl `> * + *` margin, or a tag-scoped margin under `.page-content`) |
| `layout.inline.*`    | Sibling ↔ sibling (horizontal) | How much horizontal gap between these two elements on a row? | The flex/grid parent |

`page` and `container` stack — a card inside a page is inset from the viewport by `page` padding *plus* its own `container` padding. In this site, `layout.page.md` drives the `main` element's horizontal gutter, the top nav's inner padding, and the fixed page-nav's offset. Card- and section-level insets use `layout.container.*` / `layout.stack.*`. Raw `space.*` is reserved for fixed-footprint controls (buttons, chips, table cells) and for documentation layouts that intentionally describe the scale itself.

## CSS conventions

All styles in this app live in [`app/globals.css`](app/globals.css). To keep diffs reviewable and reduce the cost of skimming a long stylesheet, every rule follows the same shape.

### Shorthand vs longhand

Use a shorthand only when **every value it writes is intentional**. If a shorthand exists only because one side has a real value and the others were zeroed out as a side effect, write the longhand instead.

| Situation | Write |
|---|---|
| Only one side has a value | `margin-top: var(--sys-layout-stack-md);` — never `margin: var(...) 0 0;` |
| Top/bottom or left/right with the same value, on purpose | `padding-block: var(--ref-space-100);` or `padding: var(--ref-space-100) 0;` (both axes intentional) |
| All four sides with one value | `padding: var(--ref-space-100);` |
| Two-axis shorthand with two real values | `padding: var(--ref-space-100) var(--ref-space-200);` |

Three- and four-value forms (`margin: a b c`, `margin: a b c d`) are not used — split them into longhands. The same rule applies to `border`, `border-radius`, `inset`, `font`, etc.: the shorthand is a tool for compressing intent, not for hiding zeros.

### Property order inside a rule

Within a single rule, properties are written outside-in — from where the box sits, to what the box contains, to how the box reacts. New properties slot into the same buckets so two rules describing similar elements line up visually.

1. **Custom properties** — `--cta-fill`, `--sem-col-token`, … (declared first so the rest of the rule can read them).
2. **Positioning** — `position`, `inset`, `top` / `right` / `bottom` / `left`, `z-index`.
3. **Display & flow** — `display`, `flex-direction`, `flex-wrap`, `align-items`, `justify-content`, `gap`, `flex`, `flex-shrink`, `grid-template-columns` / `-rows` / `-areas`, `grid-column`, `grid-row`, `grid-area`, `place-*`.
4. **Box sizing** — `box-sizing`, `width`, `min-width`, `max-width`, `height`, `min-height`, `max-height`, `aspect-ratio`.
5. **Spacing** — `margin` / `margin-*`, then `padding` / `padding-*`.
6. **Border & shape** — `border` / `border-*`, `border-radius`, `outline`.
7. **Background & surface** — `background`, `box-shadow`, `opacity`, `overflow`, `clip-path`.
8. **Typography & color** — `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `font-variant-numeric`, `text-transform`, `text-align`, `text-decoration`, `text-overflow`, `white-space`, `color`.
9. **Behavior & effects** — `cursor`, `pointer-events`, `appearance`, `user-select`, `transform`, `transition`, `animation`, `backdrop-filter`, `-webkit-*` vendor mirrors (placed directly after the standard property they mirror).

Within a bucket, write the properties in the order listed above. Skip buckets that don't apply — never insert a placeholder property to hold a slot.

### Block rhythm inside `.page-content`

`.page-content` renders the same shape as a markdown preview — bare `<h2>` / `<h3>` / `<p>` / `<ul>` / `<ol>` / table-and-grid wrappers stack as direct siblings. Spacing is owned by **tag selectors** (no class-based margins) following the github-markdown-css pattern: headings carry fixed top + bottom margins, every other block carries top-margin only, and an adjacent-sibling rule lets the heading's bottom margin define the tight gap to its first content via margin collapse.

| Selector | mt | mb | Role |
|---|---|---|---|
| `.page-content > p`, `> ul`, `> ol` | `stack-md` | `0` | Prose rhythm — consecutive paragraphs/lists sit `stack-md` apart |
| `.page-content > .sem-table`, `> .specimen-grid`, `> .guidelines-grid`, `> .type-list` | `stack-xl` | `0` | Specimen rhythm — heavier top margin sets specimen blocks apart from prose |
| `.page-content > h2` | `stack-2xl` | `stack-xs` | Major section break + tight lead-in to first content |
| `.page-content > h3` | `stack-xl` | `stack-xs` | Subsection break + tight lead-in |
| `.page-content > h2 + *`, `> h3 + *` | `0` | — | Sibling collapses its top margin so the heading's mb wins |
| `.page-content > :first-child` | `0` | — | Column top is flush |

**Two-tier rhythm: prose vs specimen.** Prose blocks (`<p>`, `<ul>`, `<ol>`) sit at `stack-md` so consecutive paragraphs read as one continuous voice. Specimen blocks (token tables, palette grids, guidelines, type lists) sit at `stack-xl` so each visual block reads as its own unit and doesn't blur into the surrounding text. The `<h2>` break is intentionally stronger than common references (Tailwind Typography, github-markdown-css use ~1.5–1.6× a paragraph gap; Chorus uses 2×) because docs pages run long and benefit from a clearer section divider.

Inner stackers (list items) keep their own scoped owl rules; the do/don't grid handles its rhythm via `row-gap` on `.guidelines-grid`, so paired Do and Don't cells share each row's height automatically.

| Selector | Token | Role |
|---|---|---|
| `.rule-list > li + li` | `stack-sm` | Card-style list items |
| `.rule-list ul > li + li` | `stack-2xs` | Nested disc bullets |
| `.guidelines-grid` (`row-gap`) | `stack-sm` | Do/don't paired rows |

**Don't reach for `display: flex; gap: ...` to space block children of `.page-content`.** Flex/grid is reserved for inline arrangement (icons + label, color-bar contents), grid composition (`sem-row`, `specimen-grid`), and component chrome (nav, footer, side-nav). Page-level prose stacks via margin so the rhythm matches what a markdown renderer would produce.

### Other house rules

- **One unit family per concept.** Spacing comes from `--sys-layout-*` / `--ref-space-*` tokens; raw `px` is reserved for fixed-footprint chrome (icons, hairlines, sticky offsets) per the spacing-axes rules above.
- **`@media` and pseudo-class rules follow the same property order** as the base rule. A media-query override sits adjacent to the rule it overrides; it is not collected at the end of the file.
- **Vendor-prefixed properties** (`-webkit-backdrop-filter`, `-webkit-font-smoothing`) sit immediately after their unprefixed counterpart, not in a separate block.
- **No duplicate declarations within a single rule.** If a property appears twice (often a leftover from refactors), collapse it.

When adding new styles, lint by eye against this section before opening a PR; reviewers will flag drift here the same way they flag drift from `DESIGN.md`.

## Running locally

From the repo root:

```bash
npm run dev
```
