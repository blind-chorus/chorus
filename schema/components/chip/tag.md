# Tag

The informational chip — square-cornered label naming attached metadata. Use for taxonomy on rows, cards, or profiles. Shorter than Filter (24 vs 32 min-height) with `sys.radius.sm` corners and a `secondaryContainer` fill because it is not a tap target.

> Inherits the Chorus-wide rules in [`DESIGN.md`](../../DESIGN.md) — color quartets, state overlays, focus ring composition. Cross-family Chip contract lives in [`chip.md`](./chip.md). Live previews render below each section so the spec and its live behaviour sit side by side.

## Default

`secondaryContainer` fill, label-only. Reads as attached metadata against the surrounding surface.

```preview
chip/tag/default
---
import { Chip } from '@blind-chorus/ui';

<Chip variant="tag">
  Design
</Chip>
```

## Use cases

### Dismissable

Opt-out form — same chip with a trailing "×" to remove the tag. The trailing icon inherits the label color via `currentColor`.

```preview
chip/tag/dismissable
---
import { Chip } from '@blind-chorus/ui';
import { CloseIcon } from '@blind-chorus/ui/icons';

<Chip
  variant="tag"
  trailingIcon={<CloseIcon />}
>
  Newsletter
</Chip>
```

### Group

Adjacent tag chips share a single `4px` gap on both axes — `sys.layout.inline.sm` between siblings, `sys.layout.stack.2xs` between rows on wrap.

Mixing with Filter is allowed — Tag's square + sunken tone vs Filter's pill + raised tone keeps roles legible.

#### Wrap on overflow

Tags are passive metadata — collections that exceed the container's width **wrap** rather than scroll or truncate. Set `display: flex; flex-wrap: wrap; gap: var(--sys-layout-inline-sm)` on the container. Do not use `overflow-x: auto` — horizontal scrolling belongs to tappable affordances.

```preview
chip/tag/group
---
import { Chip } from '@blind-chorus/ui';

<div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 320 }}>
  <Chip variant="tag">Design</Chip>
  <Chip variant="tag">Engineering</Chip>
  <Chip variant="tag">Research</Chip>
  <Chip variant="tag">Product</Chip>
  <Chip variant="tag">Marketing</Chip>
  <Chip variant="tag">Operations</Chip>
  <Chip variant="tag">Customer success</Chip>
</div>
```

### Focus indicator

Three-layer ring over the `sys.state.focus` overlay. Only the **dismissable** tag is focusable; the case below shows that form. See [DESIGN.md → Focus ring composition](../../DESIGN.md#focus-ring-composition).

```preview
chip/tag/focused
---
import { Chip } from '@blind-chorus/ui';
import { CloseIcon } from '@blind-chorus/ui/icons';

<Chip variant="tag" state="focused" trailingIcon={<CloseIcon />}>
  Newsletter
</Chip>
```

## Slots

- **label** — accessible name. Required, single line.
- **trailingIcon** (optional) — dismiss/opt-out glyph after the label (typically "×"). Tag does not carry a leading icon.

## Sizes

Same min-height, vertical padding, label rung, and label-slot inset as Filter, but horizontal outer padding tightens from 12 to **8**.

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Min-height                        | 24px                 | `ref.space.300` ‡                  |
| Padding (block × inline)          | 4 × 8                | `sys.layout.container.2xs` × `sys.layout.container.xs` |
| Label inset (within label slot)   | 4px (horizontal)     | `sys.layout.container.2xs`         |
| Slot gap (icon ↔ label)           | 0                    | — †                                |
| Radius                            | 4px                  | `sys.radius.sm`                    |
| Label                             | 12 / Semibold        | `sys.typo.label.sm`                |
| Icon                              | 16px                 | `sys.icon.md`                      |

‡ **min-height** binds to raw `ref.space.*` — `sys.*` does not expose a 24px step.

† **Slot gap is `0`** — see [Filter → Sizes](./filter.md#sizes).

Label-only Tag clears 12px on each side (8 + 4); dismissable Tag reads with a 4px label-to-glyph rhythm followed by 8px to edge.

## Variants

Single visual variant — Tag does not toggle. The container/label binding is the `secondaryContainer` quartet.

| Property              | Token                                                         |
|-----------------------|---------------------------------------------------------------|
| Background            | `sys.color.secondaryContainer`                                |
| Label / icon color    | `sys.color.onSecondaryContainer`                              |

## States

States compose with the container/label pair via [DESIGN.md → State overlays](../../DESIGN.md#state-overlays). Tag is interactive only when `trailingIcon` carries a click target; otherwise the chip is presentational and the chip body takes no state.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover` when the chip is interactive.                   |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active` when the chip is interactive.                  |
| `disabled` | overlay suppressed         | Container at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Accessibility indicator over any lifecycle state, on the dismissable form only. Three-layer ring over the `sys.state.focus` (12%) overlay. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).
