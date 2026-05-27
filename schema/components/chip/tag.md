# Tag

The informational chip — square-cornered label naming attached metadata. Use for taxonomy on rows, cards, or profiles — categories, statuses, content labels; prefer [Badge](../badge/badge.md) when the marker signals unread / new activity on a host rather than describing it. Shorter than Filter (24 vs 32 min-height) with `sys.radius.sm` corners. Two appearances: `default` paints a translucent black/white overlay (light → `ref.palette.black.200`, dark → `ref.palette.white.200`) so the tag adopts whatever surface sits behind it; `accent` paints a tonal pale-primary container with primary label for tags that need to pop.

**Layout inset.** `inline` — Tag ships no padding outside its own pill chrome. It sits inside whichever host row holds it (list-row label cluster, profile-card meta strip, feed-post header) with the host paying the surrounding gap and column padding. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), the host already owns the inset — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Translucent overlay fill, label-only. Reads as attached metadata — the overlay tints the surface one step darker (light) or lighter (dark) rather than locking to a single container tone. Omit `appearance` or pass `appearance="default"`.

```preview
chip/tag/default
---
import { Chip } from '@blind-dsai/ui';

<Chip variant="tag">
  Design
</Chip>
```

## Accent

Tonal pale-primary fill — `sys.color.primaryContainer` background with `sys.color.primary` label. Use when the tag should pop against the surface (Popular Tags in compose, highlighted hashtags); the default overlay is too quiet there.

```preview
chip/tag/accent
---
import { Chip } from '@blind-dsai/ui';

<Chip variant="tag" appearance="accent">
  #sellside
</Chip>
```

## Use cases

### Dismissable

Opt-out — same chip with a trailing "×" to remove the tag. Trailing icon inherits label color via `currentColor`.

```preview
chip/tag/dismissable
---
import { Chip } from '@blind-dsai/ui';
import { XIcon } from '@blind-dsai/ui/icons';

<Chip
  variant="tag"
  trailingIcon={<XIcon />}
>
  Newsletter
</Chip>
```

### Group

Adjacent tag chips share a `4px` gap on both axes — `sys.layout.inline.sm` between siblings, `sys.layout.stack.2xs` between rows on wrap.

Mixing with Filter is allowed — Tag's square + sunken tone vs Filter's pill + raised tone keeps roles legible.

#### Wrap on overflow

Tags are passive metadata — collections exceeding the container's width **wrap** rather than scroll or truncate. Set `display: flex; flex-wrap: wrap; gap: var(--sys-layout-inline-sm)` on the container. Do not use `overflow-x: auto` — horizontal scrolling belongs to tappable affordances.

```preview
chip/tag/group
---
import { Chip } from '@blind-dsai/ui';

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

Only the **dismissable** tag is focusable; the case below shows that form. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).

```preview
chip/tag/focused
---
import { Chip } from '@blind-dsai/ui';
import { XIcon } from '@blind-dsai/ui/icons';

<Chip variant="tag" state="focused" trailingIcon={<XIcon />}>
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

Two appearances; Tag never toggles.

### Default

| Property              | Token                                                         |
|-----------------------|---------------------------------------------------------------|
| Background (light)    | `ref.palette.black.200` (translucent black overlay)           |
| Background (dark)     | `ref.palette.white.200` (translucent white overlay)           |
| Label / icon color    | `sys.color.onSurface`                                         |

### Accent

| Property              | Token                                                         |
|-----------------------|---------------------------------------------------------------|
| Background            | `sys.color.primaryContainer` (theme-aware)                    |
| Label / icon color    | `sys.color.primary`                                           |

## States

Tag is interactive only when `trailingIcon` carries a click target; otherwise the chip is presentational and the chip body takes no state.

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover` when the chip is interactive.                   |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active` when the chip is interactive.                  |
| `disabled` | overlay suppressed         | Container at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

Standard ring on the dismissable form only. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).
