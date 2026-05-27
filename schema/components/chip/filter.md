# Filter

The selectable chip — capsule-shaped toggle for refining a set. **Unselected** is a transparent hairline-outlined pill that adopts whatever surface sits behind it; **selected** swaps to an inverse fill. Optional leading and trailing icons compose without changing footprint.

**Reach for this when** the user narrows a set by toggling one or more independent criteria — multiple chips can be on at once. **Skip when** the choices are mutually-exclusive view modes — use [Segmented](../tabs/segmented.md) instead.

**Layout inset.** inline — the chip is content-sized and inherits its surface's padding; rails compose via gap, not chrome.

## Default

At-rest form — transparent fill with a hairline `outlineVariant` stroke so the chip sits on any surface without colliding with the surface ladder.

```preview
chip/filter/unselected
---
import { Chip } from '@blind-dsai/ui';

<Chip variant="filter">
  All
</Chip>
```

## Use cases

### Selected

Active form — inverse-toned fill. Toggle the `selected` flag on the same chip element across both states.

```preview
chip/filter/selected
---
import { Chip } from '@blind-dsai/ui';

<Chip
  variant="filter"
  selected
>
  All
</Chip>
```

### With icon

Facet glyph before the label — tag for category, magnifying glass for search, check on selection.

```preview
chip/filter/leading-icon
---
import { Chip } from '@blind-dsai/ui';
import { CheckedIcon } from '@blind-dsai/ui/icons';

<Chip
  variant="filter"
  leadingIcon={<CheckedIcon />}
>
  Selected
</Chip>
```

### With trailing icon

Directional/dismiss glyph after the label — chevron-down to expand, "×" to clear.

```preview
chip/filter/trailing-icon
---
import { Chip } from '@blind-dsai/ui';
import { XIcon } from '@blind-dsai/ui/icons';

<Chip
  variant="filter"
  trailingIcon={<XIcon />}
>
  Today
</Chip>
```

### Group

Adjacent filter chips share a `4px` gap (`sys.layout.inline.sm`). Left-to-right; selection is independent per chip — Filter does not enforce single-select.

```preview
chip/filter/group
---
import { Chip } from '@blind-dsai/ui';

<div style={{ display: 'flex', gap: 4 }}>
  <Chip variant="filter" selected>
    All
  </Chip>
  <Chip variant="filter">
    Open
  </Chip>
  <Chip variant="filter">
    Closed
  </Chip>
  <Chip variant="filter">
    Archived
  </Chip>
</div>
```

### With trailing action

Pair the chip rail with a trailing accent [Text Button](../button/text.md) (`size='small'`, `appearance='accent'`) for a destination outside the filter axis — managing the set, opening keyword settings. The button is **not** a filter toggle. The chip track scrolls horizontally with a trailing 48px `mask-image` fade that paints only while overflowing; the button stays pinned outside the scroll viewport at `sys.layout.inline.xl` gap.

```preview
chip/filter/with-trailing-action
---
import { Chip, Button } from '@blind-dsai/ui';
import { ArrowDownIcon } from '@blind-dsai/ui/icons';

<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sys-layout-inline-xl)',
    width: '100%',
    boxSizing: 'border-box',
  }}
>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--sys-layout-inline-sm)',
      flex: '1 1 auto',
      minWidth: 0,
      overflowX: 'auto',
      scrollbarWidth: 'none',
      WebkitMaskImage: 'linear-gradient(to right, black 0, black calc(100% - 48px), transparent 100%)',
      maskImage: 'linear-gradient(to right, black 0, black calc(100% - 48px), transparent 100%)',
    }}
  >
    <Chip variant="filter" selected trailingIcon={<ArrowDownIcon />}>
      All keywords
    </Chip>
    <Chip variant="filter" selected trailingIcon={<ArrowDownIcon />}>
      All channels
    </Chip>
    <Chip variant="filter">
      Label
    </Chip>
    <Chip variant="filter">
      Saved
    </Chip>
  </div>
  <Button variant="text" size="small" appearance="accent" style={{ flex: '0 0 auto' }}>
    Manage
  </Button>
</div>
```

### Focus indicator

Both selection states take the same standard ring; case below shows unselected.

```preview
chip/filter/focused
---
import { Chip } from '@blind-dsai/ui';

<Chip variant="filter" state="focused">
  All
</Chip>
```

## Slots

- **label** — accessible name. Required, single line.
- **leadingIcon** (optional) — facet glyph before the label.
- **trailingIcon** (optional) — directional/dismiss glyph after the label.

## Sizes

Single fixed footprint; consistent across breakpoints.

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Min-height                        | 32px                 | `ref.space.400` ‡                  |
| Padding (block × inline)          | 4 × 12               | `sys.layout.container.2xs` × `sys.layout.container.sm` |
| Label inset (within label slot)   | 4px (horizontal)     | `sys.layout.container.2xs`         |
| Slot gap (icon ↔ label)           | 0                    | — †                                |
| Radius                            | pill                 | `sys.radius.full`                  |
| Label                             | 12 / Semibold        | `sys.typo.label.sm`                |
| Icon                              | 16px                 | `sys.icon.md`                      |

‡ Footprint shared with [Toolbar button](../button/toolbar.md) and [Tabs segmented](../tabs/segmented.md).

† Visible icon-to-label rhythm comes from the label-slot inset.

## Variants

Single visual variant; the selected/unselected toggle swaps the container/label pair wholesale.

| State        | Background                          | Border (1px `sys.borderWidth.hairline`)                 | Label / icon color                |
|--------------|-------------------------------------|---------------------------------------------------------|-----------------------------------|
| unselected   | `transparent`                       | `sys.color.outlineVariant`                              | `sys.color.onSurface`             |
| selected     | `sys.color.inverseSurface`          | `transparent`                                           | `sys.color.inverseOnSurface`      |

On `selected`, the border colour goes transparent but its 1px width is held, so footprint never changes.

## States

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `disabled` | overlay suppressed         | Container at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Standard outward ring on a `position: absolute` pseudo-element so it never affects layout. Inside a [Tabs](../tabs/segmented.md) row the same layer is re-anchored inward. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).
