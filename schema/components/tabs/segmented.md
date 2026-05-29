# Segmented

The inline view-mode toggle — a row of mutually-exclusive selectors for in-place mode changes (List ↔ Grid, Day ↔ Week ↔ Month).

**Reach for this when** the segments swap the *same* content's view or range in place — List ↔ Grid, Day ↔ Week ↔ Month. **Skip when** segments switch between *different* panels ([Underline](./underline.md)), multiple values can co-select ([Filter chip](../chip/filter.md)), or the rung is a single-select picker over a long list ([Radio list](../list/radio.md)).

**Layout inset.** `full-bleed` — **edge-to-edge** family. Sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge. The row pays its own `16px inline / 8px block` padding via `layout.container.*`; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the page rail double-pays. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Headline form — 2-segment List / Grid view toggle.

```preview
tabs/segmented/default
---
import { Tabs, Tab } from '@blind-dsai/ui';

<Tabs variant="segmented" value="list" aria-label="View mode">
  <Tab value="list">List</Tab>
  <Tab value="grid">Grid</Tab>
</Tabs>
```

## Use cases

### With icon

Leading glyph in each segment — useful when the verb alone could read as anything.

```preview
tabs/segmented/leading-icon
---
import { Tabs, Tab } from '@blind-dsai/ui';
import { CheckedIcon, PlusIcon } from '@blind-dsai/ui/icons';

<Tabs variant="segmented" value="grid" aria-label="View mode">
  <Tab value="list" leadingIcon={<CheckedIcon />}>List</Tab>
  <Tab value="grid" leadingIcon={<PlusIcon />}>Grid</Tab>
</Tabs>
```

### Overflow

When natural width exceeds the column, the row scrolls horizontally — no `fullWidth` (equal-width segments would break the shared-density contract with Filter chips). Trailing **Edge fade** (rightmost **48px** / `ref.space.600`) paints via `mask-image` only while overflow is present.

```preview
tabs/segmented/overflow
---
import { Tabs, Tab } from '@blind-dsai/ui';

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

Static specimen — pins the focus ring to a selected segment. See top-level [Focus indicator](#focus-indicator).

```preview
tabs/segmented/focused
---
import { Tabs, Tab } from '@blind-dsai/ui';

<Tabs variant="segmented" value="list" aria-label="View">
  <Tab value="list" state="focused">List</Tab>
  <Tab value="grid">Grid</Tab>
</Tabs>
```

## Slots

- **label** — segment's accessible name. Required, single line.
- **leadingIcon** (optional) — context glyph before the label.

## Anatomy

Each segment renders with `chorus-chip chorus-chip--filter` — see [Filter chip](../chip/filter.md). Selected swaps from unselected (`transparent` fill + `outlineVariant` border + `onSurface` label) to selected (`inverseSurface` fill + `inverseOnSurface` label, border `transparent` with 1px width held).

Chip behaviour inherited verbatim — except the focus ring, re-anchored as an inset overlay on a `::after` layer (segmented row is a horizontal scroller; the chip's default outward ring would clip).

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

**Composition: Inward** (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)) — row is a horizontal scroller, so an outward ring would clip at top/bottom. Paints as inset shadows inside the segment's bounding box on a `::after` so it never shifts a segment or row. Trigger: `:focus-visible`.
