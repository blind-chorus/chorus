# Nav card

A bounded single-row card — an outlined rounded surface with a label, an optional supporting line, and an optional trailing affordance. Two variants select the trailing shape: `default` ships no trailing icon (bare labelled tile), `nav` auto-renders the right-pointing chevron (the explicit drill-in form). The whole card is the tap target.

**Reach for this when** one row needs to read as its own discrete affordance — a labelled scope tile (`default`), a standalone settings drill-in (`nav`), a picker trigger, or a channel / sub-brand entry card. **Skip when** rows are stacked into a vertical column (use [List/nav](../list/nav.md)), the action is a commit (use [Button](../button/button.md)), or the surface is purely informational (use [Banner](../banner/banner.md)).

**Layout inset.** `inline` — NavCard is an inline card. It carries its own internal `16px inline / 8px block` padding (`layout.container.md` / `layout.container.xs`), `radius.md` corners, hairline outline, 48px min-height, and `width: 100%` so it fills the host column. It ships **no outer margin** and does NOT claim the page rail. The host owns the surrounding inset: at the page-shell level the shell's `layout.page.md` (16) gutter provides the horizontal safe zone; inside another host (`<Section>` body, `<BottomSheet>` content slot, `<SideSheet>` column, `<NavCardGroup>` stack) the host's container padding governs the inset. Vertical spacing between NavCards comes from `NavCardGroup`'s `gap: var(--sys-layout-stack-xs)` (8) — never paint per-child `margin-block` on NavCard.

## Default

The bare form — label only, no trailing icon. Reach for it when the card is a labelled tile (scope label, status card, informational entry) and the drill-in chevron would over-promise navigation.

```preview
nav-card/default
---
import { NavCard } from '@blind-dsai/ui';

<NavCard label="Cell label here" href="#" />
```

## Use cases

### Nav (with trailing chevron)

`variant="nav"` auto-renders the right-pointing chevron — the explicit drill-in form. Reach for it when the card routes into another surface (settings detail, picker, sub-flow).

```preview
nav-card/nav
---
import { NavCard } from '@blind-dsai/ui';

<NavCard variant="nav" label="Cell label here" href="#" />
```

### With supporting text

A two-line variant — primary label on top, supporting metadata below at `onSurfaceVariant`. Works with either variant; pair with `nav` when the drill-in is metadata-bearing.

```preview
nav-card/supporting
---
import { NavCard } from '@blind-dsai/ui';

<NavCard
  variant="nav"
  label="Saved posts"
  supportingText="47 posts across 9 channels"
  href="#"
/>
```

### With leading icon

A leading 16 × 16 glyph at the inline padding edge. **The icon vertically centres on the row's parent block** — it shares the row's `align-items: center` axis with the label-col and the trailing slot, so the glyph sits on the same midline as the label (one-line) or the label + supportingText block (two-line).

```preview
nav-card/leading-icon
---
import { NavCard } from '@blind-dsai/ui';
import { BellIcon } from '@blind-dsai/ui/icons';

<NavCard
  label="Notifications"
  leading={<BellIcon size={16} />}
  supportingText="3 unread mentions"
  href="#"
/>
```

### With leading thumbnail

A leading 32-rung [Thumbnail](../thumbnail/thumbnail.md) — used when the drill target is an entity (channel, person, brand) rather than a chrome action. The thumbnail block-centres on the row's vertical midline, same as an icon leading.

```preview
nav-card/leading-thumbnail
---
import { NavCard, Thumbnail } from '@blind-dsai/ui';

<NavCard
  variant="nav"
  label="Hyundai Motor"
  supportingText="Private · My company"
  leading={<Thumbnail size={32} alt="Hyundai" />}
  href="#"
/>
```

### Group

Multiple NavCards stacked vertically as a `NavCardGroup` — each card stays its own outlined affordance, separated by `sys.layout.stack.xs` (8px) gap. Use when several drill-in cards share a section but should read as discrete cards (vs a `list/nav` rail where rows tile flush with hairline dividers).

```preview
nav-card/group
---
import { NavCard, NavCardGroup } from '@blind-dsai/ui';
import { BellIcon, BookmarkIcon, ProfileIcon } from '@blind-dsai/ui/icons';

<NavCardGroup aria-label="Account">
  <NavCard variant="nav" label="Profile" supportingText="Display name, avatar, bio" leading={<ProfileIcon size={16} />} href="#" />
  <NavCard variant="nav" label="Saved posts" supportingText="47 posts across 9 channels" leading={<BookmarkIcon size={16} />} href="#" />
  <NavCard variant="nav" label="Notifications" leading={<BellIcon size={16} />} href="#" />
</NavCardGroup>
```

### Surface (opaque tier on a non-`surface` host)

`appearance="surface"` paints the card with its own `sys.color.surface` fill so it reads as an opaque tier. Reach for it when the card sits on a transparent / non-`surface` host (a coloured hero, a tonal band, a BottomSheet's content slot) and the default transparent fill would let the card blend into the background.

```preview
nav-card/surface
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
    <NavCard variant="nav" appearance="surface" label="Profile" supportingText="Display name, avatar, bio" leading={<ProfileIcon size={16} />} href="#" />
    <NavCard variant="nav" appearance="surface" label="Saved posts" supportingText="47 posts across 9 channels" leading={<BookmarkIcon size={16} />} href="#" />
    <NavCard variant="nav" appearance="surface" label="Notifications" leading={<BellIcon size={16} />} href="#" />
  </NavCardGroup>
</div>
```

## Slots

- **container** — outlined rounded box. `surface` fill, `radius.md` corners, hairline `outlineVariant` stroke painted as inset box-shadow (never `border:`).
- **leading** *(optional)* — 16px icon (`currentColor`) or 32-rung [Thumbnail](../thumbnail/thumbnail.md). Block-centred on the row's vertical midline — same contract for icon and thumbnail. Omitted by default; label flushes to the inline padding edge.
- **labelCol** — vertical column holding label and (optional) supportingText. `min-width: 0` so both lines truncate.
- **label** — primary card text. 14px / Regular / `onSurface`. Single line; truncates.
- **supportingText** *(optional)* — secondary line under label. 12px / Regular / `onSurfaceVariant`. Sits flush under the label with no extra top margin — line-height alone separates the two rows.
- **trailingIcon** *(optional)* — on `variant="nav"`, an auto-rendered right-pointing chevron at 16px, `onSurfaceVariant`. On `variant="default"` no trailing renders. A `trailingIcon` prop overrides either case. Slot stays block-centred regardless of one-line / two-line body.

## Anatomy

| Slot           | Token bindings |
|----------------|----------------|
| container      | `surface` fill, `radius.md` corners, hairline `outlineVariant` inset box-shadow, `48px` min-height, `8px` block / `16px` inline padding |
| leading        | 16 × 16 (`sys.icon.md`) glyph in `currentColor` or 32 × 32 [Thumbnail](../thumbnail/thumbnail.md). Block-centred on the row's vertical midline (same contract for icon and thumbnail). `sys.layout.inline.md` (8px) gap to label column |
| labelCol       | Flex column, `min-width: 0`, no inter-line margin (line-height carries the rhythm) |
| label          | `sys.typo.body.sm` (14 / Regular) / `onSurface` |
| supportingText | `sys.typo.caption.md` (12 / Regular) / `onSurfaceVariant`, no top margin |
| trailingIcon   | 16 × 16, `onSurfaceVariant`, `sys.layout.inline.md` (8px) gap to label column. Auto-rendered chevron on `variant="nav"`; omitted on `variant="default"` unless `trailingIcon` is supplied. Always block-centred. |
| group          | `NavCardGroup` flex column, `sys.layout.stack.xs` (8px) gap between cards |

## Appearance

| Appearance | Container fill                  | When to reach |
|------------|---------------------------------|----------------|
| `default`  | `transparent`                   | The canonical form. NavCard's identity is the outlined chrome (hairline + radius + label + chevron); host surface tone reads through. State overlays mix on the transparent base. |
| `surface`  | `sys.color.surface` (opaque)    | NavCard on a transparent / non-`surface` host (coloured hero, tonal band, BottomSheet content). Outline, label, chevron, and state overlays unchanged. |

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

Outward 3-layer ring painted on the container's outer edge via an `::after` overlay (rest stroke sits on `::before`). Trigger: `:focus-visible`. Composition: NavCard sits as its own bounded surface with margin to siblings, so an outward ring reads cleanly — see [Focus ring composition](../../DESIGN.md#focus-ring-composition).

## Behavior

- **Whole card is the click target.** The trailing chevron is never a separate hit target.
- **Element swap.** Renders `<button>` by default; `<a href>` when `href` is set.
- **Truncation, not wrap.** Both label and supportingText truncate with ellipsis; the card never grows to fit long text.
