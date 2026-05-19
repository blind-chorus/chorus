# FAB

Floating action button — surface-elevated commit anchored to the canvas, reachable while content scrolls (mobile list canvases, drawing surfaces, feeds). Independent contract from standard [Button](./button.md): single fixed sizing rung, label and icon both optional (at least one present), pill geometry (`sys.radius.full`), floating elevation (`sys.elevation.floating`).

## Intent

Use FAB as the *single* headline action of a scrollable canvas — anchored to the viewport so it stays reachable as content moves underneath. Prefer [Button](./button.md) when the action lives inline with content (forms, rows, dialogs) rather than floating above it.

## Primary

The default FAB — brand-red fill anchoring the canvas's headline action.

```preview
button/fab/primary
---
import { Button } from '@blind-chorus/ui';
import { AddIcon } from '@blind-chorus/ui/icons';

<Button
  variant="fab"
  appearance="primary"
  icon={<AddIcon />}
>
  Compose
</Button>
```

## Secondary

A theme-toned FAB that defers to the canvas's surface tones. Reach for this when a brand-red FAB would over-claim the page's visual hierarchy.

```preview
button/fab/secondary
---
import { Button } from '@blind-chorus/ui';
import { AddIcon } from '@blind-chorus/ui/icons';

<Button
  variant="fab"
  appearance="secondary"
  icon={<AddIcon />}
>
  Compose
</Button>
```

## Use cases

### Icon

Icon-only form — 48 × 48 circle with a 24px glyph. For universally legible actions (`+`, pencil). **Always carry an `aria-label`.**

```preview
button/fab/icon
---
import { Button } from '@blind-chorus/ui';
import { AddIcon } from '@blind-chorus/ui/icons';

<Button
  variant="fab"
  appearance="primary"
  icon={<AddIcon />}
  aria-label="Add"
/>
```

### Text

Label-only form — pill with no glyph. For multi-word actions or verbs without an obvious glyph (*Save draft*).

```preview
button/fab/text
---
import { Button } from '@blind-chorus/ui';

<Button variant="fab" appearance="primary">
  Compose
</Button>
```

### Extended

Icon + label form. Default for primary canvas commits where space allows (desktop canvases, mobile sheets).

```preview
button/fab/extended
---
import { Button } from '@blind-chorus/ui';
import { AddIcon } from '@blind-chorus/ui/icons';

<Button
  variant="fab"
  appearance="primary"
  icon={<AddIcon />}
>
  Add item
</Button>
```

### Focus indicator

Standard ring with the FAB's floating elevation stacked underneath. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).

```preview
button/fab/focused
---
import { Button } from '@blind-chorus/ui';
import { AddIcon } from '@blind-chorus/ui/icons';

<Button variant="fab" appearance="primary" state="focused" icon={<AddIcon />}>
  Compose
</Button>
```

## Appearance

Two appearances on the same emphasis ladder the standard [Button](./button.md) uses — `primary` for the canvas's headline commit, `secondary` for the quieter alternative when a brand-loud floating affordance would over-claim.

| Appearance  | Background                       | Label / icon color   | When to reach for it                                                                              |
|-------------|----------------------------------|----------------------|---------------------------------------------------------------------------------------------------|
| `primary`   | `sys.color.brand`                | `sys.color.onBrand`  | Brand-red commit anchoring the canvas's intended next step (Compose, Add, Create). The FAB wears `brand` (red) rather than `color.primary` (blue) so it reads as the screen's single high-attention identity moment. |
| `secondary` | `sys.color.surfaceContainerHigh` | `sys.color.onSurface` | Theme-toned alternative on dense or chromatic canvases (filtered map, image-rich feed) where a brand-red FAB would over-claim the hierarchy. |

## Slots

- **icon** (optional) — 24px glyph naming the action. Inherits foreground via `currentColor` per the [family rule](./button.md#icon-colour-inheritance-family-wide).
- **label** (optional) — short verb phrase. Internally padded so the glyph never crowds the rounded ends.

At least one must be present — the three combinations are [Icon](#icon), [Text](#text), and [Extended](#extended).

## Sizes

Single fixed rung — no size axis; same control on every viewport.

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Min-height                        | 48px                 | `ref.space.600` ‡                  |
| Padding (all sides)               | 12px                 | `sys.layout.container.sm`          |
| Icon size                         | 24px                 | `sys.icon.lg`                      |
| Slot gap (icon ↔ label)           | 0                    | —                                  |
| Label inset (within label slot)   | 4px (all sides)      | `sys.layout.container.2xs`         |
| Radius                            | pill / circle        | `sys.radius.full`                  |
| Elevation                         | floating             | `sys.elevation.floating`           |

‡ **min-height** binds to raw `ref.space.*` — `sys.*` does not expose a 48px step.

**Label-slot 4px inset.** Outer 12px padding alone would crowd the rounded ends, so the label slot adds another `container.2xs` only when text is present:

- **Text-only FABs** clear 16px on each side (12 + 4).
- **Icon-only FABs** stay a clean 48 × 48 (12 + 24 + 12).
- **Icon + text FABs** — icon flush at 12px, label with its own 4px inset, trailing 12px padding.

## States

The focus ring is a `position: absolute` pseudo-element stacked above the FAB's `box-shadow` so the floating elevation survives focus.

**No disabled state.** If the action isn't available, hide the FAB rather than render it dimmed.

## Focus indicator

**Composition: Outward** — standard ring on a `::after` overlay above the FAB's `box-shadow`. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).
