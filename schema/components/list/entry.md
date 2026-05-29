# Entry list

Directory-entry [List](./list.md) sub-component — edge-to-edge rows pairing an optional leading [Thumbnail](../thumbnail/thumbnail.md) (rung 32 / 40 / 48 / 56 via `size="small|medium|large|xlarge"`) with an identity group (label + optional inline `count` Badge + optional stacked `secondary` line that tiles flush) and an optional single-line `description`. Same click semantics as [Text sub](./text.md); row geometry, state overlays, and inward focus ring delegate to the [family-wide rules](./list.md).

**Reach for this when** rendering an entity-row directory — follow suggestion, member directory, subscription / channel / topic / playlist directory, mention / recipient picker, entity search result — or, with `thumbnail` omitted, label-only nav rows (settings menu, category index). **Skip when** you need a Feed-specific attribution cluster (use [Metadata](../metadata/metadata.md) for Post / Ad card heads).

**Layout inset.** full-bleed — sits as a direct child of the page shell. Each row pays its own `16px inline / 8px block` padding via `layout.container.md` / `layout.container.xs`; do **not** wrap the list in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Directory entry rows — pick the Thumbnail rung via the **Size** dropdown (`xlarge` 56 → `small` 32). Row payload (label + stacked secondary + single-line description + trailing follow toggle) stays constant; only the leading avatar footprint changes. At `xlarge` the inter-row divider anchors to the text column (16 + 56 + 12 = 84) so the rule reads as separating identity columns under the wider avatar.

```preview
list/entry
---
import { Button, List } from '@blind-dsai/ui';

<List
  variant="entry"
  size="medium"
  items={[
    {
      value: 'sourdough-bakers',
      label: 'Sourdough Bakers',
      secondary: '12.4K Followers',
      description: 'Open-crumb obsession, cold-proof timelines, weekend bakes.',
      thumbnail: { src: '/placeholder.png', alt: 'Sourdough Bakers' },
      trailingIcon: (
        <Button variant="toggle" onClick={() => {}}>Follow</Button>
      ),
    },
    {
      value: 'indie-game-devs',
      label: 'Indie Game Devs',
      secondary: '8,210 Followers',
      description: 'Solo dev diaries, first-release postmortems, jam recaps.',
      thumbnail: { src: '/placeholder.png', alt: 'Indie Game Devs' },
      trailingIcon: (
        <Button variant="toggle" onClick={() => {}}>Follow</Button>
      ),
    },
  ]}
/>
```

## Use cases

### With trailing star toggle

Uses the **single-shape fill-only contract**: always `<StarFillIcon>`, color flips by state (active = `var(--sys-color-icon-yellow)`, inactive = `var(--sys-color-icon-muted)`). Shape stays constant so the trailing rail keeps a stable hit-target footprint — never swap between outline (`StarIcon`) and fill (`StarFillIcon`) for the same affordance. Rows with a trailing affordance default to `size="small"` (32) — the smaller leading footprint keeps the trailing rail visually balanced.

```preview
list/entry-with-star
---
import { Badge, Button, List } from '@blind-dsai/ui';
import { StarFillIcon } from '@blind-dsai/ui/icons';

<List
  variant="entry"
  size="small"
  items={[
    {
      value: 'sourdough',
      label: 'Sourdough Bakers',
      count: <Badge count={12} />,
      thumbnail: { src: '/placeholder.png', alt: 'Sourdough Bakers' },
      trailingIcon: (
        <Button
          variant="icon"
          size="medium"
          aria-label="Favorited"
          aria-pressed="true"
          icon={<StarFillIcon />}
          style={{ color: 'var(--sys-color-icon-yellow)' }}
          onClick={() => {}}
        />
      ),
    },
    {
      value: 'stocks',
      label: 'Stocks & Investing',
      count: <Badge count={142} />,
      thumbnail: { src: '/placeholder.png', alt: 'Stocks & Investing' },
    },
    {
      value: 'movie-talk',
      label: 'Movie Talk',
      count: <Badge count={24} />,
      thumbnail: { src: '/placeholder.png', alt: 'Movie Talk' },
      trailingIcon: (
        <Button
          variant="icon"
          size="medium"
          aria-label="Favorite"
          aria-pressed="false"
          icon={<StarFillIcon />}
          style={{ color: 'var(--sys-color-icon-muted)' }}
          onClick={() => {}}
        />
      ),
    },
  ]}
/>
```

### As nav option (trailing chevron Icon Button)

The trailing slot carries a default [Icon Button](../button/icon.md) (`variant="icon"`, `size="medium"`) filled with a right-pointing chevron — the canonical nav-option drill-in affordance. Reach for it when the row routes to a sub-page and you still want to expose an identity-bearing thumbnail (workspace switch, channel directory drill-in). For pure label-only nav stacks, omit `thumbnail` instead — see [the label-only case below](#label-only-no-thumbnail).

```preview
list/entry-as-nav-option
---
import { Button, List } from '@blind-dsai/ui';
import { ChevronRightIcon } from '@blind-dsai/ui/icons';

<List
  variant="entry"
  size="medium"
  items={[
    {
      value: 'sourdough',
      label: 'Sourdough Bakers',
      secondary: '12.4K Followers',
      thumbnail: { src: '/placeholder.png', alt: 'Sourdough Bakers' },
      trailingIcon: (
        <Button
          variant="icon"
          size="medium"
          aria-label="Open Sourdough Bakers"
          icon={<ChevronRightIcon />}
          onClick={() => {}}
        />
      ),
    },
    {
      value: 'indie-game-devs',
      label: 'Indie Game Devs',
      secondary: '8,210 Followers',
      thumbnail: { src: '/placeholder.png', alt: 'Indie Game Devs' },
      trailingIcon: (
        <Button
          variant="icon"
          size="medium"
          aria-label="Open Indie Game Devs"
          icon={<ChevronRightIcon />}
          onClick={() => {}}
        />
      ),
    },
  ]}
/>
```

### Label only (no thumbnail)

Omit `thumbnail` on a row to collapse the leading column — the label sits flush at the 16 inline rail and the row reads as a label-only entry. Reach for it on settings menus, category indexes, and *pick a sub-page* stacks. Pair with a trailing chevron Icon Button to assemble the canonical nav-option row; this is the shape [NavList](../nav-list/nav-list.md) bundles under its header.

```preview
list/entry-label-only
---
import { Button, List } from '@blind-dsai/ui';
import { ChevronRightIcon } from '@blind-dsai/ui/icons';

<List
  variant="entry"
  items={[
    {
      value: 'location',
      label: 'Location',
      trailingIcon: (
        <Button variant="icon" size="medium" aria-label="Open Location" icon={<ChevronRightIcon />} onClick={() => {}} />
      ),
    },
    {
      value: 'job',
      label: 'Job Function',
      trailingIcon: (
        <Button variant="icon" size="medium" aria-label="Open Job Function" icon={<ChevronRightIcon />} onClick={() => {}} />
      ),
    },
    {
      value: 'learning',
      label: 'Learning & Advising',
      trailingIcon: (
        <Button variant="icon" size="medium" aria-label="Open Learning & Advising" icon={<ChevronRightIcon />} onClick={() => {}} />
      ),
    },
    {
      value: 'money',
      label: 'Money',
      trailingIcon: (
        <Button variant="icon" size="medium" aria-label="Open Money" icon={<ChevronRightIcon />} onClick={() => {}} />
      ),
    },
  ]}
/>
```

## Slots

- **container** — outer vertical stack (delegates to family).
- **row** — single list item; whole row is the click target.
- **leading** *(optional)* — [Thumbnail](../thumbnail/thumbnail.md) at the list's `size` rung (32 / 40 / 48 / 56). `thumbnail` props forward verbatim. Omit per row to collapse the leading column entirely — the leading→text gap (12) also drops, and the label sits flush at the 16 inline rail. Mix-and-match per row is supported.
- **label** — primary row text. `sys.typo.label.md` (14 / Semibold) / `sys.color.onSurface`. Pairs flush with `count` on the primary line.
- **count** *(optional)* — inline node painted to the right of the label on the same line (canonical: `<Badge count={n} />`). Separated by `sys.layout.inline.sm` (4); label shrinks first so a long name truncates against the count.
- **secondary** *(optional)* — stacked meta line below the label inside the identity group (follower count, location). `sys.typo.caption.md` (12 / Regular) / `sys.color.onSurface`. Tiles flush with the label — line-height-only spacing, no margin — so the two lines read as one tight identity block.
- **description** *(optional)* — single-line caption-tone supporting line below the identity group. `sys.typo.caption.md` (12 / Regular) / `sys.color.onSurfaceVariant`. Separated from the identity group by `ref.space.25` (2). Truncates with ellipsis; never wraps.
- **trailingIcon** *(optional, per-row)* — consumer-supplied node at the trailing edge. Canonical fills: `<Button variant="toggle">` (Follow), `<Button variant="icon">` (favorite / overflow), `<Badge>`. Its own hit target — clicks stop propagating before reaching the row.
- **divider** *(optional, per-row)* — pass `divider: false` to suppress the row's bottom hairline. Use when a visual group ends mid-stack and the divider would visually fence off the next group from its label.

## Anatomy

| Slot                       | Token bindings |
|----------------------------|----------------|
| row container              | Block / inline padding (`layout.container.md` inline rail across every rung). Block: `8px` (`layout.container.xs`) at `small` / `medium` / `large`, `12px` (`layout.container.sm`) at `xlarge` — the 56 rung's identity stack reads denser. `min-height: 48` (`ref.space.600`). |
| leading thumbnail *(optional)* | 32 (`size="small"`) / 40 (`size="medium"`) / 48 (`size="large"`) / 56 (`size="xlarge"`). Omit per row to collapse the leading column. |
| leading → text column      | `sys.layout.inline.lg` (12) when leading is present — Entry-specific override of the family-wide `inline.md` (8) row gap. Drops to `0` when `thumbnail` is omitted. |
| label                      | `sys.typo.label.md` (14 / Semibold) / `onSurface`, single-line ellipsis |
| label → count              | `sys.layout.inline.sm` (4) |
| count                      | inline node — canonical `<Badge>` |
| label → secondary          | `0` — line-height only |
| secondary                  | `sys.typo.caption.md` (12 / Regular) / `onSurface`, single-line ellipsis |
| identity group → description | `ref.space.25` (2) |
| description                | `sys.typo.caption.md` (12 / Regular) / `onSurfaceVariant`, single-line ellipsis |
| text column → trailing     | `sys.layout.inline.sm` (4) |
| trailingIcon               | `<Button variant="icon">`, `<Button variant="toggle">`, `<Button variant="text" appearance="accent">`, or `<Badge>` |
| inter-row divider          | `1px` `outlineVariant`. Default (`small` / `medium` / `large`): `16` inset from both edges. `xlarge`: leading inset anchors to the text column (`16 + 56 + 12 = 84`) so the rule reads as separating identity columns; trailing inset stays at `16`. **Label-only rows** (no thumbnail): leading inset falls back to the default `16` regardless of `size`. |

## States

No `selected` state. State overlays (hover / pressed / disabled) and the inward focus ring delegate to the [family-wide rules](./list.md#cross-sub-contract).

## Behavior

- **Thumbnail is optional, per row.** Drop `thumbnail` from a row to collapse the leading column and the `leading → text` (12) gap; the label sits flush at the 16 inline rail. For pure label-only nav stacks, [NavList](../nav-list/nav-list.md) bundles this shape under a header.
- **Identity group is tight.** Label + (inline count) on the primary line, optional `secondary` stacked flush below — line-height-only spacing — so the entire identity group reads as one block.
- **Divider inset switches at `xlarge`.** Default rungs: hairline inset `16` from both edges so the rule reads as separating *content*. At `xlarge` the leading inset anchors to the text column (`16 + 56 + 12 = 84`) — the 56 avatar is large enough that a row-edge divider reads as a hard line under the avatar.
- **Block padding bumps at `xlarge`.** Default rungs use `container.xs` (8); `xlarge` bumps to `container.sm` (12) — the 56 rung's identity stack needs an extra step of breathing room.
- **Description is the supporting layer.** Sits below the identity group with `ref.space.25` (2) of separation. Always single-line; truncates. The row never grows to fit longer copy.
- **Truncates, never wraps.** Label and description both truncate; trailing slot is never pushed off-row by long text.
- **Trailing slot is its own hit target.** Clicks inside `trailingIcon` stop propagating before reaching the row — wire favorite / follow / overflow there without committing the row's primary action.
- **Keyboard navigation.** Arrow ↑ / ↓ moves focus between rows; Home / End jump to first / last.
