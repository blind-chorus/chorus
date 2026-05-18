# Toggle Button

Commit-and-record action — a Toolbar-footprint button with two states. **Inactive** invites the commit (`primary` fill); **active** records it (`surfaceContainerHigh` + hairline `outlineVariant`). Use for reversible actions that persist across views — follows, subscriptions, joins.

> Inherits the Chorus-wide rules in [`DESIGN.md`](../../DESIGN.md) — color quartets, state overlays, focus ring composition. Cross-family contract lives in [`button.md`](./button.md). Visual chrome (sizing, padding, radius, label rung, icon size, state overlays) mirrors [Toolbar Button](./toolbar.md) and [Filter chip](../chip/filter.md) verbatim — only the container/label pair differs.

## Inactive

The at-rest urging form — `primary` fill, no border. Reach for this whenever the action is offered but not yet taken.

```preview
button/toggle/inactive
---
import { Button } from '@blind-chorus/ui';

<Button variant="toggle">
  Follow
</Button>
```

## Active

The committed form — `surfaceContainerHigh` fill with hairline `outlineVariant` stroke. Use the same button element across both states and toggle the `active` flag; the consumer swaps the label text in tandem. The button reports its state to assistive tech via `aria-pressed`.

```preview
button/toggle/active
---
import { Button } from '@blind-chorus/ui';

<Button variant="toggle" active>
  Following
</Button>
```

## Use cases

### With icon

A check glyph on commit reinforces the active read. Keep the inactive form glyph-less.

```preview
button/toggle/with-icon
---
import { Button } from '@blind-chorus/ui';
import { CheckedIcon } from '@blind-chorus/ui/icons';

<Button variant="toggle" active leadingIcon={<CheckedIcon />}>
  Following
</Button>
```

### Focus indicator

Three-layer ring over the `sys.state.focus` overlay. Both forms take the same ring; the case below shows inactive. See [DESIGN.md → Focus ring composition](../../DESIGN.md#focus-ring-composition).

```preview
button/toggle/focused
---
import { Button } from '@blind-chorus/ui';

<Button variant="toggle" state="focused">
  Follow
</Button>
```

## Slots

- **label** — accessible name. Required, single line. Consumer swaps the verb between states ("Follow" → "Following"); the toggle does not auto-rewrite.
- **leadingIcon** (optional) — context glyph before the label. Inherits colour via `currentColor` per the [family rule](./button.md#icon-colour-inheritance-family-wide).
- **trailingIcon** (optional) — directional/destination glyph after the label. Same contract as [Toolbar Button](./toolbar.md#with-trailing-icon).

## Sizes

Single fixed footprint — identical to [Toolbar Button](./toolbar.md#sizes) and [Filter chip](../chip/filter.md#sizes).

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Min-height                        | 32px                 | `ref.space.400`                    |
| Padding (block × inline)          | 4 × 12               | `sys.layout.container.2xs` × `sys.layout.container.sm` |
| Label inset (within label slot)   | 4px (horizontal)     | `sys.layout.container.2xs`         |
| Slot gap (icon ↔ label)           | 0                    | —                                  |
| Radius                            | pill                 | `sys.radius.full`                  |
| Label                             | 12 / Semibold        | `sys.typo.label.sm`                |
| Icon                              | 16px                 | `sys.icon.md`                      |

## Variants

A single visual variant — the inactive/active toggle is expressed as a state on the same button rather than a fork in the variant axis. The container/label pair swaps wholesale on commit, mirroring the [Filter chip](../chip/filter.md#variants) selection contract.

| State        | Background                          | Border (always 1px `sys.borderWidth.hairline`)          | Label / icon color                | Notes                                                                |
|--------------|-------------------------------------|---------------------------------------------------------|-----------------------------------|----------------------------------------------------------------------|
| inactive     | `sys.color.primary`                 | `transparent`                                           | `sys.color.onPrimary`             | Brand-loud fill that invites the commit. Border colour is `transparent` but its 1px width is held so the button never changes footprint between states. |
| active       | `sys.color.surfaceContainerHigh`    | `sys.color.outlineVariant`                              | `sys.color.onSurface`             | The committed form — Toolbar Button / Filter unselected chrome verbatim. The neutral fill records the state without continuing to claim attention. |

## States

States compose with the active container/label pair via [DESIGN.md → State overlays](../../DESIGN.md#state-overlays) — **label color** over **container color** at the state's opacity.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `disabled` | overlay suppressed         | Container at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. The hairline stroke (active form) is kept because the variant's identity is the stroke. |

## Focus indicator

Accessibility indicator over any lifecycle state. Three-layer ring over the `sys.state.focus` (12%) overlay; `position: absolute` pseudo-element so it never affects layout. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).
