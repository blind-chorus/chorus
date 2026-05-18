# Segmented

The inline view-mode toggle — a row of mutually-exclusive selectors for in-place mode changes (List ↔ Grid, Day ↔ Week ↔ Month). For panel-switching navigation, reach for [Underline](./underline.md) instead.

## Default

The headline form — a 2-segment List / Grid view toggle.

```preview
tabs/segmented/default
---
import { Tabs, Tab } from '@blind-chorus/ui';

<Tabs variant="segmented" value="list" aria-label="View mode">
  <Tab value="list">List</Tab>
  <Tab value="grid">Grid</Tab>
</Tabs>
```

## Use cases

### With icon

A leading glyph in each segment — useful when the verb alone could read as anything.

```preview
tabs/segmented/leading-icon
---
import { Tabs, Tab } from '@blind-chorus/ui';
import { CheckedIcon, AddIcon } from '@blind-chorus/ui/icons';

<Tabs variant="segmented" value="grid" aria-label="View mode">
  <Tab value="list" leadingIcon={<CheckedIcon />}>List</Tab>
  <Tab value="grid" leadingIcon={<AddIcon />}>Grid</Tab>
</Tabs>
```

### Overflow

When the row's natural width exceeds the surrounding column, it scrolls horizontally instead of compressing segments — no `fullWidth` because equal-width segments would break the shared-density contract with Filter chips. A trailing **Edge fade** (rightmost **48px** / `ref.space.600`) paints via `mask-image` only while overflow is present.

```preview
tabs/segmented/overflow
---
import { Tabs, Tab } from '@blind-chorus/ui';

<Tabs variant="segmented" value="day" aria-label="Range">
  <Tab value="day">Day</Tab>
  <Tab value="week">Week</Tab>
  <Tab value="month">Month</Tab>
  <Tab value="quarter">Quarter</Tab>
  <Tab value="year">Year</Tab>
  <Tab value="decade">Decade</Tab>
  <Tab value="century">Century</Tab>
</Tabs>
```

### Focus indicator

Static design-review specimen — pins the keyboard-focus ring to a selected segment. See the top-level [Focus indicator](#focus-indicator) below for composition.

```preview
tabs/segmented/focused
---
import { Tabs, Tab } from '@blind-chorus/ui';

<Tabs variant="segmented" value="list" aria-label="View">
  <Tab value="list" state="focused">List</Tab>
  <Tab value="grid">Grid</Tab>
</Tabs>
```

## Slots

- **label** — segment's accessible name. Required, single line.
- **leadingIcon** (optional) — context glyph before the label.

## Anatomy

Each segment renders with `chorus-chip chorus-chip--filter` — see [Filter chip](../chip/filter.md) for the full visual contract. Selected segment swaps from the unselected pair (`surfaceContainerHigh` + `outlineVariant` border + `onSurface` label) to the selected pair (`inverseSurface` fill + `inverseOnSurface` label, border `transparent` with 1px width held so footprint stays).

Chip behaviour inherited verbatim — except the focus ring, which is re-anchored as an inset overlay on a `::after` layer (the segmented row is a horizontal scroller, so the chip's default outward ring would clip).

## Sizes

Row container only — segment-internal sizing (min-height, padding, radius, typo, icon) is delegated to [Filter chip → Sizes](../chip/filter.md#sizes).

| Property                                | Value                | Token                              |
|-----------------------------------------|----------------------|-------------------------------------|
| Container background                    | transparent          | —                                  |
| Container padding (block)               | 16px                 | `sys.layout.container.md`          |
| Container padding (inline)              | 16px                 | `sys.layout.container.md`          |
| Inter-segment gap                       | 4px                  | `sys.layout.inline.sm`             |
| Segment min-height / radius / typo / etc.| (inherited)         | see [Filter chip](../chip/filter.md#sizes) |

## States

Delegates to [Filter chip](../chip/filter.md) — segment chrome composes identically.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `selected` | —                          | Swap to inverse-surface pair; hairline border goes `transparent` (1px held). |
| `disabled` | overlay suppressed         | Container at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

**Composition: Inward** (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)) — the row is a horizontal scroller, so an outward ring would clip at the top and bottom edges. The ring paints as inset shadows inside the segment's bounding box, drawn on a `::after` so it never shifts a segment or the row. Trigger: `:focus-visible`.
