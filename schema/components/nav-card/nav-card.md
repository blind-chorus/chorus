# Nav card

A bounded single-row navigation card — an outlined rounded surface with a leading label, an optional supporting line, and an auto-rendered trailing chevron. The whole card is the drill-in tap target.

**Reach for this when** one drill-in row needs to read as its own discrete affordance — a standalone settings entry between content blocks, a picker trigger sitting on its own, a channel / scope selector card, or a bounded-surface drill-in where the host already supplies the surrounding stack rhythm. **Skip when** the drill-in rows are stacked into a vertical column (use [List/nav](../list/nav.md) — the hairline-divider chrome reads better than repeated outlined boxes), the action is a commit (use [Button](../button/button.md) instead of a chevron card), or the surface is purely informational with no drill-in target (use [Banner](../banner/banner.md)).

**Layout inset.** `full-bleed` — sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge inside it. The card pays its own `16px inline / 8px block` padding via `layout.container.*`; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the page rail double-pays and the card edge lands at a different inset than the section headings and list rows around it. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

The bare form — label and auto-rendered trailing chevron.

```preview
nav-card/default
---
import { NavCard } from '@blind-dsai/ui';

<NavCard label="Cell label here" href="#" />
```

## Use cases

### With supporting text

A two-line variant — primary label on top, supporting metadata below at `onSurfaceVariant`.

```preview
nav-card/supporting
---
import { NavCard } from '@blind-dsai/ui';

<NavCard
  label="Saved posts"
  supportingText="47 posts across 9 channels"
  href="#"
/>
```

### With leading icon

A leading 16 × 16 glyph anchored at the inline padding edge, vertically centred against the label column.

```preview
nav-card/leading-icon
---
import { NavCard } from '@blind-dsai/ui';
import { BellIcon } from '@blind-dsai/ui/icons';

<NavCard
  label="Notifications"
  leading={<BellIcon size={16} />}
  href="#"
/>
```

### With leading thumbnail

A leading 32-rung [Thumbnail](../thumbnail/thumbnail.md) — used when the drill target is an entity (channel, person, brand) rather than a chrome action.

```preview
nav-card/leading-thumbnail
---
import { NavCard, Thumbnail } from '@blind-dsai/ui';

<NavCard
  label="Hyundai Motor"
  supportingText="Private · My company"
  leading={<Thumbnail size={32} alt="Hyundai" />}
  href="#"
/>
```

### Group

Multiple NavCards stacked vertically as a `NavCardGroup` — each card stays its own outlined affordance, separated by `sys.layout.stack.xs` (8px) gap. Use a group when several drill-in cards share a logical section but should still read as discrete cards (vs a `list/nav` rail where rows tile flush with hairline dividers).

```preview
nav-card/group
---
import { NavCard, NavCardGroup } from '@blind-dsai/ui';
import { BellIcon, BookmarkIcon, ProfileIcon } from '@blind-dsai/ui/icons';

<NavCardGroup aria-label="Account">
  <NavCard label="Profile" supportingText="Display name, avatar, bio" leading={<ProfileIcon size={16} />} href="#" />
  <NavCard label="Saved posts" supportingText="47 posts across 9 channels" leading={<BookmarkIcon size={16} />} href="#" />
  <NavCard label="Notifications" leading={<BellIcon size={16} />} href="#" />
</NavCardGroup>
```

### Transparent (on a tonal band)

`appearance="transparent"` removes the card's `surface` fill so the host surface tone reads through — the outline, label, and chevron stay intact. Reach for it when the card sits on a tonal band (`surfaceContainerLow`, `surfaceVariant`, a Section body) and should read as **attached to** that tone rather than as its own opaque tier.

```preview
nav-card/transparent
---
import { NavCard, NavCardGroup } from '@blind-dsai/ui';
import { BellIcon, BookmarkIcon, ProfileIcon } from '@blind-dsai/ui/icons';

<div
  style={{
    background: 'var(--sys-color-surfaceContainerLow)',
    padding: 'var(--sys-layout-container-md)',
    borderRadius: 'var(--sys-radius-lg)',
  }}
>
  <NavCardGroup aria-label="Account">
    <NavCard appearance="transparent" label="Profile" supportingText="Display name, avatar, bio" leading={<ProfileIcon size={16} />} href="#" />
    <NavCard appearance="transparent" label="Saved posts" supportingText="47 posts across 9 channels" leading={<BookmarkIcon size={16} />} href="#" />
    <NavCard appearance="transparent" label="Notifications" leading={<BellIcon size={16} />} href="#" />
  </NavCardGroup>
</div>
```

## Slots

- **container** — outlined rounded box. `surface` fill, `radius.md` corners, hairline `outlineVariant` stroke painted as inset box-shadow (never `border:`).
- **leading** *(optional)* — 16px icon (`currentColor`) or 32-rung [Thumbnail](../thumbnail/thumbnail.md). Omitted by default; label flushes to the inline padding edge.
- **labelCol** — vertical column holding label and (optional) supportingText. `min-width: 0` so both lines truncate.
- **label** — primary card text. 14px / Regular / `onSurface`. Single line; truncates.
- **supportingText** *(optional)* — secondary line under label. 12px / Regular / `onSurfaceVariant`. Sits flush under the label with no extra top margin — line-height alone separates the two rows.
- **trailingIcon** — auto-rendered right-pointing chevron at 16px, `onSurfaceVariant`. A `trailingIcon` prop overrides.

## Anatomy

| Slot           | Token bindings |
|----------------|----------------|
| container      | `surface` fill, `radius.md` corners, hairline `outlineVariant` inset box-shadow, `48px` min-height, `8px` block / `16px` inline padding |
| leading        | 16 × 16 icon (`currentColor`) or 32 × 32 Thumbnail; `sys.layout.inline.md` (8px) gap to label column |
| labelCol       | Flex column, `min-width: 0`, no inter-line margin (line-height carries the rhythm) |
| label          | `sys.typo.body.sm` (14 / Regular) / `onSurface` |
| supportingText | `sys.typo.caption.md` (12 / Regular) / `onSurfaceVariant`, no top margin |
| trailingIcon   | 16 × 16, `onSurfaceVariant`, `sys.layout.inline.md` (8px) gap to label column |
| group          | `NavCardGroup` flex column, `sys.layout.stack.xs` (8px) gap between cards |

## Appearance

| Appearance     | Container fill                  | When to reach |
|----------------|---------------------------------|----------------|
| `default`      | `sys.color.surface` (opaque)    | NavCard on a transparent or distinct-tone host — the canonical form. |
| `transparent`  | `transparent`                   | NavCard placed inside a tonal band (`surfaceContainerLow`, Section body, BottomSheet content) so the host tone reads through. Outline, label, chevron, and hover overlay stay intact. |

## Sizes

A single rung. Min-height 48 (touch-target floor); consumers cannot shrink or grow the card.

## States

| State      | Overlay                       | Additional |
|------------|-------------------------------|------------|
| `default`  | —                             | Outlined surface at rest. |
| `hovered`  | label tone at `sys.state.hover`   | Overlay paints across the container. |
| `pressed`  | label tone at `sys.state.pressed` | Overlay deepens; no other shift. |
| `disabled` | overlay suppressed            | Container at `sys.state.disabled` opacity; `pointer-events: none`. |

## Focus indicator

Outward 3-layer ring painted on the container's outer edge via an `::after` overlay (the rest stroke sits on `::before` so the two layers don't fight). Trigger: `:focus-visible`. Composition rationale: NavCard sits as its own bounded surface with margin to siblings, so an outward ring reads cleanly without colliding with neighbour strokes — see [Focus ring composition](../../DESIGN.md#focus-ring-composition).

## Behavior

- **Whole card is the click target.** The trailing chevron is never a separate hit target.
- **Element swap.** Renders `<button>` by default; `<a href>` when `href` is set.
- **Truncation, not wrap.** Both label and supportingText truncate with ellipsis; the card never grows to fit long text.
