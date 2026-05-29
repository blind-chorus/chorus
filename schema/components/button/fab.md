# FAB

Floating action button — surface-elevated commit anchored to the canvas, reachable while content scrolls. Single fixed rung with a pill geometry (`sys.radius.full`) and floating elevation (`sys.elevation.floating`); label and icon both optional, at least one present.

**Reach for this when** the canvas needs a single headline action that survives scroll — Compose, Add, Create. **Skip when** the action lives inline with content (use [Standard Button](./standard.md)) or the row is a dense toolbar ([Toolbar Button](./toolbar.md)).

**Layout inset.** inline — ships no padding outside its own pill chrome. Sits inside an overlay container anchoring it to the canvas (fixed positioner, bottom-right docked layer) with the host paying the offset to the page rail and safe-area inset. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), the host already owns the inset — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Brand-red fill anchoring the canvas's headline action — `appearance="primary"`. One per scrollable canvas.

```preview
button/fab/primary
---
import { Button } from '@blind-dsai/ui';
import { PlusIcon } from '@blind-dsai/ui/icons';

<Button
  variant="fab"
  appearance="primary"
  icon={<PlusIcon />}
>
  Compose
</Button>
```

## Use cases

### Secondary

Theme-toned FAB that defers to the canvas's surface tones. Reach for it when a brand-red FAB would over-claim the page hierarchy (filtered map, image-rich feed).

```preview
button/fab/secondary
---
import { Button } from '@blind-dsai/ui';
import { PlusIcon } from '@blind-dsai/ui/icons';

<Button
  variant="fab"
  appearance="secondary"
  icon={<PlusIcon />}
>
  Compose
</Button>
```

### Icon

Icon-only — 48 × 48 circle with a 24px glyph. For universally legible actions (`+`, pencil). **Requires `aria-label`.**

```preview
button/fab/icon
---
import { Button } from '@blind-dsai/ui';
import { PlusIcon } from '@blind-dsai/ui/icons';

<Button
  variant="fab"
  appearance="primary"
  icon={<PlusIcon />}
  aria-label="Add"
/>
```

### Text

Label-only pill. For multi-word actions or verbs without an obvious glyph (*Save draft*).

```preview
button/fab/text
---
import { Button } from '@blind-dsai/ui';

<Button variant="fab" appearance="primary">
  Compose
</Button>
```

### Extended

Icon + label. Default for primary canvas commits where space allows (desktop canvases, mobile sheets).

```preview
button/fab/extended
---
import { Button } from '@blind-dsai/ui';
import { PlusIcon } from '@blind-dsai/ui/icons';

<Button
  variant="fab"
  appearance="primary"
  icon={<PlusIcon />}
>
  Add item
</Button>
```

### Focus indicator

Standard ring with the FAB's floating elevation stacked underneath. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).

```preview
button/fab/focused
---
import { Button } from '@blind-dsai/ui';
import { PlusIcon } from '@blind-dsai/ui/icons';

<Button variant="fab" appearance="primary" state="focused" icon={<PlusIcon />}>
  Compose
</Button>
```

## Slots

- **icon** (optional) — 24px glyph. Inherits foreground via `currentColor` per the [family rule](./button.md#icon-colour-inheritance-family-wide).
- **label** (optional) — short verb phrase. Internally padded so the glyph never crowds the rounded ends.

At least one must be present — combinations: [Icon](#icon), [Text](#text), [Extended](#extended).

## Appearance

Two appearances on the standard [Button](./button.md) emphasis ladder — `primary` for the canvas headline commit, `secondary` for the quieter alternative. FAB wears `brand` (red) rather than `color.primary` (blue) — the screen's single high-attention moment.

| Appearance  | Background                       | Label / icon color   | When to reach for it                                                                              |
|-------------|----------------------------------|----------------------|---------------------------------------------------------------------------------------------------|
| `primary`   | `sys.color.brand`                | `sys.color.onBrand`  | Brand-red commit anchoring the canvas's next step (Compose, Add, Create). |
| `secondary` | `sys.color.surfaceContainerHigh` | `sys.color.onSurface` | Theme-toned alternative on dense/chromatic canvases where brand-red would over-claim. |

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

**Label-slot 4px inset.** Outer 12px padding alone would crowd the rounded ends; the label slot adds another `container.2xs` only when text is present:

- **Text-only** — clears 16px each side (12 + 4).
- **Icon-only** — clean 48 × 48 (12 + 24 + 12).
- **Icon + text** — icon flush at 12px, label with 4px inset, trailing 12px padding.

## States

The focus ring is a `position: absolute` pseudo-element stacked above the FAB's `box-shadow` so the floating elevation survives focus.

**No disabled state.** If the action isn't available, hide the FAB rather than render it dimmed.

## Focus indicator

Standard outward ring on a `::after` overlay above the FAB's `box-shadow`. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).
