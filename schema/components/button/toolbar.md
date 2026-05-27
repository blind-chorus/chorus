# Toolbar

Dense inline action — a 32-tall capsule for toolbars, table-row actions, and inline menu triggers. Chrome shared with [Filter chip](../chip/filter.md) and [Tabs Segmented](../tabs/segmented.md) so a mixed row reads at one density; divergence is intent (Toolbar fires, Filter toggles, Segmented enforces single-select).

**Reach for this when** a dense row needs an inline action — toolbar opener, table-row action, inline menu trigger. **Skip when** the standard inline shape fits ([Button](./button.md)), the affordance floats above content ([FAB](./fab.md)), or the row is body-text density ([Text Button](./text.md)).

**Layout inset.** inline — content-sized; inherits the surrounding row's padding and gap.

## Default

The base shape — label-only on the Filter-chip chrome.

```preview
button/toolbar/default
---
import { Button } from '@blind-dsai/ui';

<Button variant="toolbar">
  Edit
</Button>
```

## Use cases

### Accent

Brand-blue fill, `onPrimary` label — the single-commit form. Reach for it when the Toolbar Button IS the surface's commit affordance.

```preview
button/toolbar/accent
---
import { Button } from '@blind-dsai/ui';

<Button variant="toolbar" appearance="accent">
  Save
</Button>
```

### Inverse

Mirror for inverse hosts (snackbars, coach-mark surfaces). Same geometry; colour pair flips to the inverse cluster.

```preview
button/toolbar/inverse
---
import { Button } from '@blind-dsai/ui';

<Button variant="toolbar" appearance="inverse">
  Open
</Button>
```

### With icon

Context glyph before the label — tag for "Filters", calendar for "Pick date".

```preview
button/toolbar/leading-icon
---
import { Button } from '@blind-dsai/ui';
import { PlusIcon } from '@blind-dsai/ui/icons';

<Button
  variant="toolbar"
  leadingIcon={<PlusIcon />}
>
  Add row
</Button>
```

### With trailing icon

Directional/destination glyph — chevron-down "opens a menu", "×" "clear". Unlike standard [Button](./button.md), Toolbar Button carries trailing icons because its role is often *trigger* rather than commit.

```preview
button/toolbar/trailing-icon
---
import { Button } from '@blind-dsai/ui';
import { CheckedIcon } from '@blind-dsai/ui/icons';

<Button
  variant="toolbar"
  trailingIcon={<CheckedIcon />}
>
  Sort by date
</Button>
```

### Icon only

Glyph-only Toolbar Button in a 32×32 square. Requires `aria-label`. When the label slot is absent, inline padding drops to `sys.layout.container.xs` (8) so the glyph centers.

```preview
button/toolbar/icon-only
---
import { Button } from '@blind-dsai/ui';
import { PlusIcon } from '@blind-dsai/ui/icons';

<Button
  variant="toolbar"
  leadingIcon={<PlusIcon />}
  aria-label="Add"
/>
```

### Group

Adjacent Toolbar Buttons share the same `4px` gap (`sys.layout.inline.sm`) as Filter chips. Mix freely with Filter chips.

```preview
button/toolbar/group
---
import { Button } from '@blind-dsai/ui';
import { PlusIcon, CheckedIcon } from '@blind-dsai/ui/icons';

<div style={{ display: 'flex', gap: 4 }}>
  <Button variant="toolbar" leadingIcon={<PlusIcon />}>
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

Hairline stroke is kept underneath the standard ring.

```preview
button/toolbar/focused
---
import { Button } from '@blind-dsai/ui';
import { PlusIcon } from '@blind-dsai/ui/icons';

<Button variant="toolbar" state="focused" leadingIcon={<PlusIcon />}>
  Add row
</Button>
```

## Slots

- **label** — accessible name. Required, single line.
- **leadingIcon** (optional) — context glyph before the label.
- **trailingIcon** (optional) — directional/destination glyph after the label.

## Appearance

Only the container ↔ label colour pair flips; geometry stays identical. For inline destructive commits reach for the standard [Button](./button.md) `secondary` flavored as `destructive`.

| Appearance  | Background                          | Border                                          | Label / icon                       | When to reach for it |
|-------------|-------------------------------------|--------------------------------------------------|------------------------------------|----------------------|
| `default`   | `sys.color.surfaceContainerHigh`    | 1px `sys.color.outlineVariant`                   | `sys.color.onSurface`              | Quiet inline action — toolbar opener, "Edit" beside a row title. |
| `accent`    | `sys.color.primary`                 | none                                             | `sys.color.onPrimary`              | The single commit — a [Page](../navigation-bar/page.md) bar's "Save". Never two in a row. |
| `inverse`   | `sys.color.inverseSurface`          | none                                             | `sys.color.inverseOnSurface`       | Inside an inverse host (Toast, coach-mark). |

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

‡ Footprint shared with [Filter chip](../chip/filter.md) and [Tabs Segmented](../tabs/segmented.md).

† See [Filter → Sizes](../chip/filter.md#sizes).

## States

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | `:hover`.                                                                   |
| `pressed`  | `sys.state.pressed` (16%)  | `:active`.                                                                  |
| `disabled` | overlay suppressed         | Container at `sys.state.disabled` (40%) opacity, hairline stroke kept, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Standard outward ring with hairline stroke kept underneath. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).
