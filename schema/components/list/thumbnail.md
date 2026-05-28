# Thumbnail list

Avatar-anchored List sub-component — each row is fronted by a leading [Thumbnail](../thumbnail/thumbnail.md). Two densities: **Default** carries a 40px Thumbnail with optional `supportingText` for directory / author rows; **Compact** carries a 32px Thumbnail, 14px single-line label, inline `count` slot for an unread / quantity Badge, and no inter-row divider — the reach for subscription / channel / topic / playlist rows where each row is *one entity + its current count + an optional toggle*. Same click semantics as [Text sub](./text.md). Row geometry, state overlays, and inward focus ring delegate to the [family-wide rules](./list.md); this sub documents the leading Thumbnail slot, density dial, and count / trailing slots.

**Layout inset.** `full-bleed` — sits as a direct child of the page shell. Each row pays its own `16px inline / 8px block` padding via `layout.container.md` / `layout.container.xs`; do **not** wrap the list in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Channel / source / author rows anchored by leading thumbnails. Thumbnail fixed at the 40 rung, vertically centred against the label column.

```preview
list/thumbnail
---
import { List } from '@blind-dsai/ui';

<List
  variant="thumbnail"
  items={[
    { value: 'design-weekly', label: 'Design Weekly', supportingText: 'Updated 2h ago', thumbnail: { alt: 'Design Weekly' } },
    { value: 'frontend',      label: 'Frontend Friday', supportingText: 'Updated 1d ago', thumbnail: { alt: 'Frontend Friday' } },
    { value: 'changelog',     label: 'Changelog',       supportingText: 'Updated 3d ago', thumbnail: { alt: 'Changelog' } },
  ]}
/>
```

## Compact

`density="compact"` — 32px Thumbnail, 14px single-line label, 8px (`layout.inline.md`) leading-to-label gap, row Hug at 48, **no inter-row divider**. The `count` slot paints inline after the label (canonical: numeric `<Badge>`); the **`trailingIcon` slot is per-row optional** — supply it on rows that need a trailing toggle (favorite ★, mute, pin), omit it on rows where the count alone is enough. Mixed rows (some with toggle, some without) read cleanly because trailing-edge geometry stays stable across present-vs-absent toggles. The trailing slot stops click propagation so toggling it never commits the row's `onClick`. Reach for compact on subscription / channel / topic / playlist / quick-access lists.

```preview
list/thumbnail-compact-with-count
---
import { Badge, Button, List } from '@blind-dsai/ui';
import { StarIcon, StarFillIcon } from '@blind-dsai/ui/icons';

<List
  variant="thumbnail"
  density="compact"
  aria-label="Subscribed channels"
  items={[
    {
      value: 'sourdough',
      label: 'Sourdough Bakers',
      thumbnail: { alt: 'Sourdough Bakers' },
      count: <Badge size="small" count={12} />,
      trailingIcon: (
        <Button variant="icon" size="medium" aria-label="Favorite" icon={<StarFillIcon />} onClick={() => {}} />
      ),
    },
    {
      value: 'stocks',
      label: 'Stocks & Investing',
      thumbnail: { alt: 'Stocks & Investing' },
      count: <Badge size="small" count={142} />,
    },
    {
      value: 'movies',
      label: 'Movie Talk',
      thumbnail: { alt: 'Movie Talk' },
      count: <Badge size="small" count={24} />,
      trailingIcon: (
        <Button variant="icon" size="medium" aria-label="Favorite" icon={<StarIcon />} onClick={() => {}} />
      ),
    },
    {
      value: 'changelog',
      label: 'Product changelog',
      thumbnail: { alt: 'Product changelog' },
      count: <Badge size="small" count={3} />,
    },
  ]}
/>
```

Rows 2 and 4 above omit `trailingIcon` — only the count is present. Rows 1 and 3 carry the favorite toggle. Rows without a toggle let the label column extend to the trailing rail (count docks at the row's inline-padding edge); rows with a toggle dock the toggle at the trailing rail and the label column shrinks to fit. The thumbnail / leading rail stays constant across the stack.

## Use cases

### Without divider

`divider: false` on a row suppresses its bottom hairline rule — useful when a visual group ends mid-stack and the divider would visually fence off the next group from its label. Comfortable density only (compact density already omits every divider). The row's footprint and inline padding stay unchanged.

```preview
list/thumbnail-without-divider
---
import { List } from '@blind-dsai/ui';

<List
  variant="thumbnail"
  items={[
    { value: 'design-weekly', label: 'Design Weekly', supportingText: 'Updated 2h ago', thumbnail: { alt: 'Design Weekly' } },
    { value: 'frontend',      label: 'Frontend Friday', supportingText: 'Updated 1d ago', thumbnail: { alt: 'Frontend Friday' }, divider: false },
    { value: 'changelog',     label: 'Changelog',       supportingText: 'Updated 3d ago', thumbnail: { alt: 'Changelog' } },
  ]}
/>
```

### With trailing action

A Text Button in the row's `trailingIcon` slot — the canonical "directory row + small commit" composition. Reach for it on follow / join / invite rows where the leading Thumbnail anchors the entity and the trailing button is the only commit. Row body stays informational.

```preview
list/thumbnail-with-trailing-action
---
import { Button, List } from '@blind-dsai/ui';

<List
  variant="thumbnail"
  aria-label="Suggested channels"
  items={[
    {
      value: 'product',
      label: 'Product Design',
      supportingText: '1,204 colleagues following',
      thumbnail: { alt: 'Product Design', shape: 'circle' },
      trailingIcon: (
        <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
          Follow
        </Button>
      ),
    },
    {
      value: 'frontend',
      label: 'Frontend',
      supportingText: '892 colleagues following',
      thumbnail: { alt: 'Frontend', shape: 'circle' },
      trailingIcon: (
        <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
          Follow
        </Button>
      ),
    },
  ]}
/>
```

## Slots

- **container** — outer vertical stack (delegates to family).
- **row** — single list item; whole row is the click target.
- **leading** — required. [Thumbnail](../thumbnail/thumbnail.md), vertically centred. Density `comfortable` → 40px; density `compact` → 32px. `thumbnail` props (`src`, `alt`, `updateDot`, `logoBadge`) forward verbatim.
- **label** — primary row text. Density `comfortable` → 16px; density `compact` → 14px. Regular weight, `onSurface`.
- **supportingText** *(optional, comfortable only)* — secondary line under label. Sits directly under the label with no extra gap. Ignored when `density="compact"`.
- **count** *(optional)* — inline node painted after the label (canonical: a numeric `<Badge>`). Available in both densities.
- **trailingIcon** *(optional, per-row)* — consumer-supplied 16px node at the trailing edge. Each row decides independently — mix rows with a trailing toggle (favorite / mute / pin) and rows without. Its own hit target: a tap on this slot stops propagating before it reaches the row's `onClick`.
- **divider** *(optional, per-row, comfortable density only)* — pass `divider: false` to suppress the row's bottom hairline. Use when a visual group ends mid-stack and the divider would visually fence off the next group from its label. Compact density already omits every divider so this prop is a no-op there.

## States

No `selected` state.

## Focus indicator

Inward 3-layer ring inside the row's bounds — see [Focus indicator](./list.md#cross-sub-contract).

## Behavior

- **Keyboard navigation.** Arrow ↑ / ↓ moves focus; Home / End jump to first / last.
- **Row click target.** Whole row is clickable; the thumbnail is never a separate hit target.
- **Trailing slot is its own hit target.** Clicks inside `trailingIcon` stop propagating before they reach the row — wire a favorite / mute / pin toggle there without it committing the row's primary action.
