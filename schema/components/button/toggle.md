# Toggle

Commit-and-record action — a Toolbar-footprint button with two states. **Inactive** invites the commit (`primary` fill); **active** records it (`surfaceContainerHigh` + hairline `outlineVariant`). Use for reversible actions that persist across views — follows, subscriptions, joins.

**Layout inset.** `inline` — ships no padding outside its own chrome. Sits inside a host slot (profile card footer, channel header, list-row trailing slot) with the host paying surrounding rhythm. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), the host already owns the inset — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Inactive

The at-rest urging form — `primary` fill, no border. Used when the action is offered but not yet taken.

```preview
button/toggle/inactive
---
import { Button } from '@blind-dsai/ui';

<Button variant="toggle">
  Follow
</Button>
```

## Active

The committed form — `surfaceContainerHigh` fill with hairline `outlineVariant` stroke. Use the same element across both states and toggle the `active` flag; the consumer swaps the label text. Reports state via `aria-pressed`.

```preview
button/toggle/active
---
import { Button } from '@blind-dsai/ui';

<Button variant="toggle" active>
  Following
</Button>
```

## Use cases

### With icon

A check glyph on commit reinforces the active read. Inactive form stays glyph-less.

```preview
button/toggle/with-icon
---
import { Button } from '@blind-dsai/ui';
import { CheckedIcon } from '@blind-dsai/ui/icons';

<Button variant="toggle" active leadingIcon={<CheckedIcon />}>
  Following
</Button>
```

### Focus indicator

Both forms take the same standard ring; below shows inactive. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).

```preview
button/toggle/focused
---
import { Button } from '@blind-dsai/ui';

<Button variant="toggle" state="focused">
  Follow
</Button>
```

## Slots

- **label** — accessible name. Required, single line. Consumer swaps the verb between states ("Follow" → "Following"); no auto-rewrite.
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

A single visual variant — inactive/active is expressed as a state on the same button. Container/label pair swaps wholesale on commit, mirroring the [Filter chip](../chip/filter.md#variants) selection contract.

| State        | Background                          | Border (always 1px `sys.borderWidth.hairline`)          | Label / icon color                | Notes                                                                |
|--------------|-------------------------------------|---------------------------------------------------------|-----------------------------------|----------------------------------------------------------------------|
| inactive     | `sys.color.primary`                 | `transparent`                                           | `sys.color.onPrimary`             | Brand-loud fill inviting commit. Border `transparent` but 1px width held so footprint never changes between states. |
| active       | `sys.color.surfaceContainerHigh`    | `sys.color.outlineVariant`                              | `sys.color.onSurface`             | Committed form — Toolbar Button / Filter unselected chrome verbatim. Neutral fill records state without claiming attention. |

## States

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `disabled` | overlay suppressed         | Container at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. The hairline stroke (active form) is kept because the variant's identity is the stroke. |

## Focus indicator

Standard ring drawn as a `position: absolute` pseudo-element so it never affects layout. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).
