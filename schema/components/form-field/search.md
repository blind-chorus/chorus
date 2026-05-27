# Search bar

The search-shaped single-line field — a sibling of [Input](./input.md) with a leading `SearchIcon` and a `sys.radius.full` pill corner. Box, stroke, placeholder rule, clear button, and focus ring are inherited from Input unchanged. **Bare box only — no `label`, `helper`, `maxLength`, or `error` appearance.** Error reporting belongs to a labelled Input; a search rung that needs to flag failure should switch to one.

**Layout inset.** `inline` — Search ships no padding outside its own pill chrome. It sits inside whichever host slot holds it (a NavigationBar search row, a filter sheet header, a page-body search row) with the host paying the surrounding inline padding. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), the host already owns the inset — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

The neutral at-rest search bar — transparent fill, hairline `outlineVariant` stroke, `SearchIcon` at the left, placeholder in the faint `outline` colour. Type into the live specimen and the placeholder gives way to full-strength `onSurface` text, the stroke steps to its `active` treatment, and the trailing clear ("×") button appears at the right edge — the whole lifecycle on one preview.

```preview
form-field/search/default
---
import { FormField } from '@blind-dsai/ui';

<FormField variant="search" placeholder="Search" />
```

## Use cases

### Focus indicator

The Chorus focus ring layered on top of the `active` pill border. Same composition as [Input → Focus indicator](./input.md#focus-indicator).

```preview
form-field/search/focused
---
import { FormField } from '@blind-dsai/ui';

<FormField
  variant="search"
  placeholder="Search"
  state="focused"
/>
```

## Appearance

Single `default` appearance — Search Bar does **not** carry an `error` form. Error reporting belongs to a labelled [Input](./input.md#appearance), which can pair the `error` re-tone with assistive text in the same colour; a bare search rung has no rung to host that message and so the appearance is intentionally omitted.

## Slots

- **container** — pill box. Same as Input's container, radius stepped to `sys.radius.full`.
- **leading** — `SearchIcon` at `sys.icon.md` (16px), pinned at the inner-left edge with an 8px gap. Inherits the field's text colour; decorative (`aria-hidden`).
- **input** — same as Input. Pair with an `aria-label` at the call site.
- **clear** — same as Input. Trailing "×" shown only while the box is active and holds a value.

## Sizes

Same fixed footprint as Input — 40px tall — radius stepped to full. Inline column reads `[icon 16] [text] [clear 16]`.

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Height                            | 40px                 | `ref.space.500`                     |
| Padding (block × inline)          | 8 × 12               | `sys.layout.container.xs` × `sys.layout.container.sm` |
| Slot gap (leading ↔ input ↔ clear)| 8px                  | `sys.layout.inline.md`              |
| Radius                            | full (pill)          | `sys.radius.full`                   |
| Leading icon                      | 16px                 | `sys.icon.md`                       |
| Clear icon                        | 16px                 | `sys.icon.md`                       |
| Stroke (rest / hover)             | 1px                  | `sys.borderWidth.hairline`          |
| Stroke (active)                   | 2px                  | `sys.borderWidth.thin`              |
| Text / placeholder                | 16 / Regular         | `sys.typo.body.md`                  |

Stroke is an inset `box-shadow`, focus ring is a `position: absolute` overlay — footprint pixel-stable in every state. See [Input → Sizes](./input.md#sizes).

## States

Identical to Input — see [Input → States](./input.md#states). The leading glyph follows the field's text colour.

## Focus indicator

Composition: Outward (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)). On a `position: absolute` `::after` overlay, sits above the `active` border. Trigger: `:focus-visible`.

## Behavior

- **Search action.** The glyph is decorative; the search is performed by the input via `onChange` or `Enter`.
- **Clear button.** Same rule as Input — see [Input → Behavior](./input.md#behavior).
- **Placeholder vs. value.** Same value-driven swap; pair with an `aria-label` at the call site.
- **Single line.** Long values scroll horizontally.
