# Toolbar Button

Dense inline action — a 32-tall capsule for toolbars, table-row actions, and inline menu triggers where the standard [Button](./button.md) would crowd. Chrome shared with [Filter chip](../chip/filter.md) and [Tabs Segmented](../tabs/segmented.md) so a mixed row reads at one density; divergence is intent (Toolbar fires actions, Filter toggles selection, Segmented enforces single-select).

## Primary

The single-commit form — `primary` fill, `onPrimary` label. Reach for it when the Toolbar Button IS the surface's commit affordance.

```preview
button/toolbar/primary
---
import { Button } from '@blind-chorus/ui';

<Button variant="toolbar" appearance="primary">
  Save
</Button>
```

## Secondary

The lower-emphasis tier — label-only on the Filter-chip chrome. The base shape for dense rows where no entry should claim commit-rank attention.

```preview
button/toolbar/secondary
---
import { Button } from '@blind-chorus/ui';

<Button variant="toolbar">
  Edit
</Button>
```

## Use cases

### With icon

A context glyph before the label — tag for "Filters", calendar for "Pick date". Same composition as Filter chip's leading slot.

```preview
button/toolbar/leading-icon
---
import { Button } from '@blind-chorus/ui';
import { AddIcon } from '@blind-chorus/ui/icons';

<Button
  variant="toolbar"
  leadingIcon={<AddIcon />}
>
  Add row
</Button>
```

### With trailing icon

Directional/destination glyph after the label — chevron-down for "opens a menu", "×" for "clear". Unlike standard [Button](./button.md), Toolbar Button carries trailing icons because its role is often *trigger* rather than commit.

```preview
button/toolbar/trailing-icon
---
import { Button } from '@blind-chorus/ui';
import { CheckedIcon } from '@blind-chorus/ui/icons';

<Button
  variant="toolbar"
  trailingIcon={<CheckedIcon />}
>
  Sort by date
</Button>
```

### Icon only

Glyph-only Toolbar Button in a 32×32 square — for universally recognizable actions ("+", refresh, "×"). Requires `aria-label`. When the label slot is absent, inline padding drops from `sys.layout.container.sm` (12) to `sys.layout.container.xs` (8) so the glyph centers in a perfect square — same rule as [FAB](./fab.md#sizes).

```preview
button/toolbar/icon-only
---
import { Button } from '@blind-chorus/ui';
import { AddIcon } from '@blind-chorus/ui/icons';

<Button
  variant="toolbar"
  leadingIcon={<AddIcon />}
  aria-label="Add"
/>
```

### Group

Adjacent Toolbar Buttons share the same `4px` gap (`sys.layout.inline.sm`) as [Filter chip's group](../chip/filter.md#group). Mix freely with Filter chips in a single toolbar.

```preview
button/toolbar/group
---
import { Button } from '@blind-chorus/ui';
import { AddIcon, CheckedIcon } from '@blind-chorus/ui/icons';

<div style={{ display: 'flex', gap: 4 }}>
  <Button variant="toolbar" leadingIcon={<AddIcon />}>
    Add
  </Button>
  <Button variant="toolbar">
    Edit
  </Button>
  <Button variant="toolbar" trailingIcon={<CheckedIcon />}>
    Sort
  </Button>
</div>
```

### Focus indicator

Hairline stroke is kept underneath the standard ring (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)).

```preview
button/toolbar/focused
---
import { Button } from '@blind-chorus/ui';
import { AddIcon } from '@blind-chorus/ui/icons';

<Button variant="toolbar" state="focused" leadingIcon={<AddIcon />}>
  Add row
</Button>
```

## Appearance

Two appearances on the same emphasis ladder the standard [Button](./button.md) uses — `primary` for the surface's commit affordance, `secondary` for the quieter inline action that lives in a row of peers. Only the container ↔ label colour pair flips; geometry stays identical. Each specimen above carries a **Disabled** toggle.

| Appearance  | Background                          | Border                                          | Label / icon              | When to reach for it |
|-------------|-------------------------------------|--------------------------------------------------|---------------------------|----------------------|
| `primary`   | `sys.color.primary`                 | none                                             | `sys.color.onPrimary`     | The single commit affordance on the surface — a [Page](../navigation-bar/page.md) bar's "Save" / "Done". Never two in the same row. |
| `secondary` | `sys.color.surfaceContainerHigh`    | 1px `sys.color.outlineVariant`                   | `sys.color.onSurface`     | Quiet inline action in a row of peers — a toolbar opener "Filters ⌄", an "Edit" beside a row title. Mirrors [Filter chip's](../chip/filter.md) unselected chrome. |

Destructive is intentionally **not** an appearance here — for inline destructive commits reach for the standard [Button](./button.md) `secondary` flavored as `destructive` so the warning weight isn't swallowed by the dense Toolbar rung.

## Slots

- **label** — accessible name. Required, single line.
- **leadingIcon** (optional) — context glyph before the label. Inherits colour via `currentColor` per the [family rule](./button.md#icon-colour-inheritance-family-wide).
- **trailingIcon** (optional) — directional/destination glyph after the label. Same inheritance as leading.

## Sizes

A single fixed 32px footprint across breakpoints.

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Min-height                        | 32px                 | `ref.space.400` ‡                  |
| Padding (block × inline)          | 4 × 12               | `sys.layout.container.2xs` × `sys.layout.container.sm` |
| Label inset (within label slot)   | 4px (horizontal)     | `sys.layout.container.2xs`         |
| Slot gap (icon ↔ label)           | 0                    | — †                                |
| Radius                            | pill                 | `sys.radius.full`                  |
| Label                             | 12 / Semibold        | `sys.typo.label.sm`                |
| Icon                              | 16px                 | `sys.icon.md`                      |

‡ **min-height** binds to raw `ref.space.*` — `sys.*` does not expose a 32px step. Footprint shared with [Filter chip](../chip/filter.md) and [Tabs Segmented](../tabs/segmented.md).

† **Slot gap is `0`** — see [Filter → Sizes](../chip/filter.md#sizes).

## States

The focus ring is a `position: absolute` pseudo-element so it never affects layout.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `disabled` | overlay suppressed         | Container at `sys.state.disabled` (40%) opacity, hairline stroke kept (the variant's identity is the stroke), focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Standard ring with hairline stroke kept underneath (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)). Trigger: `:focus-visible`.
