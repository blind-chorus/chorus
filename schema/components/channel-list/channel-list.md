# Channel List

A vertically-stacked block of channel recommendations rendered as a swipeable pager. One page shows three channel rows; the next page peeks at the trailing edge to invite the swipe. Each row pairs a 48px [Thumbnail](../thumbnail/thumbnail.md), a stacked text column (name / followers / description), and a trailing [Toggle Button](../button/toggle.md) flipping between "Follow" and "Following".

> Inherits the Chorus-wide rules in [`DESIGN.md`](../../DESIGN.md). Avatar delegates to [Thumbnail](../thumbnail/thumbnail.md); action to [Toggle Button](../button/toggle.md). This file documents only Channel List-specific composition.

## Default

A two-page list (six channels) with a "See all" action in the header.

```preview
channel-list/default
---
import { ChannelList } from '@blind-chorus/ui';

<ChannelList
  label="Recommended channels"
  headerAction={{ label: 'See all', href: '/channels' }}
  items={[
    { value: 'sourdough', name: 'Sourdough Bakers', followers: '12.4K Followers', description: 'Open-crumb obsession, cold-proof timing, starter help.', thumbnail: { alt: 'Sourdough Bakers' } },
    { value: 'indiedev',  name: 'Indie Game Devs',  followers: '8,210 Followers', description: 'Shipping logs, postmortems, marketing on a budget.', thumbnail: { alt: 'Indie Game Devs' } },
    { value: 'plants',    name: 'Plant People',     followers: '21.7K Followers', description: 'Houseplant troubleshooting and propagation threads.', thumbnail: { alt: 'Plant People' } },
    { value: 'movies',    name: 'Movie Talk',       followers: '34.2K Followers', description: 'Festival coverage, director threads, link shares.', thumbnail: { alt: 'Movie Talk' } },
    { value: 'mods',      name: 'Community Mods',   followers: '1,840 Followers', description: 'Weekly digests and rules discussion across channels.', thumbnail: { alt: 'Community Mods' } },
    { value: 'amas',      name: 'AMAs',             followers: '5,120 Followers', description: 'Scheduled Q&A sessions with founders and creators.', thumbnail: { alt: 'AMAs' } },
  ]}
/>
```

## Slots

- **container** — `surface` block with 24px block / 16px inline padding. Holds the header above the pager.
- **header** — single row at the top; section label leading, optional text-link action trailing. Anchored outside the pager.
- **label** — section title. `heading.md` (20px / Semibold) / `onSurface`.
- **headerAction** *(optional)* — [`xsmall` Text Button](../button/text.md), `primary` appearance. Renders as `<a>` when `href` is set.
- **pager** — horizontally-scrolling track with mandatory inline scroll-snap; native scrollbar hidden. Next page peeks at the trailing edge.
- **page** — one swipe target. Vertical stack of exactly three rows.
- **row** — channel suggestion. Flex: avatar → text column → trailing toggle.
- **avatar** — [Thumbnail](../thumbnail/thumbnail.md) at the 48 rung. Forwards `src`, `alt`, `updateDot`, `logoBadge`.
- **textColumn** — vertical stack with name / followers / description. Each line truncates.
- **channelName** — `label.md` (14px / Semibold) / `onSurface`.
- **followers** — `caption.md` (12px / Regular) / `onSurface`.
- **description** — `caption.md` (12px / Regular) / `onSurfaceVariant`.
- **trailingAction** — [Toggle Button](../button/toggle.md). The row itself is not clickable.

## Anatomy

| Slot           | Token bindings |
|----------------|----------------|
| container      | `surface` fill, 24px block / 16px inline padding, vertical stack |
| header         | Flex row, items centred, `space-between`. Container stack (`sys.layout.stack.lg` = 24px) separates from pager. |
| label          | `heading.md` / Semibold / `onSurface` |
| headerAction   | `xsmall` [Text Button](../button/text.md), `primary` appearance |
| pager          | Horizontal scroll, `scroll-snap-type: x mandatory`, scrollbar hidden; `sys.layout.inline.xl` (16/24px) gap; bleeds via `margin-right: -1 × sys.layout.container.md` |
| page           | `flex: 0 0 calc(100% - sys.layout.inline.xl - sys.layout.inline.md)` so the next page leading edge shows by 8px; `scroll-snap-align: start`; `sys.layout.stack.sm` (12px) between rows |
| row            | Flex row, items centred; 12px avatar↔text and text↔toggle; 12px bottom padding; `::after` divider 1px / `outlineVariant`, left-anchored to text column (60px from row left) |
| avatar         | [Thumbnail](../thumbnail/thumbnail.md) `size={48}` |
| textColumn     | Flex column, `min-width: 0`, 2px stack between lines |
| trailingAction | [Toggle Button](../button/toggle.md), `variant="toggle"` |

## Sizes

A single rung. Avatar size (48), header type, action type, and the three-rows-per-page contract are fixed.

## States

Container has no interactive state. Each row's only interactive surface is its **trailingAction** — a Toggle Button obeying the [Toggle Button](../button/toggle.md) state contract. Row body is presentational; tapping the row does not route.

The **headerAction** is an `xsmall` Text Button (rendered as `<a>` when `href` is set) — carries Text Button hover overlay + standard focus ring.

## Focus indicator

Row body is presentational; the only row-level focus target is the trailing Toggle Button (Outward ring per its spec). headerAction also paints its own Outward ring. Composition for any future row-level focus target: Inward — rows tile with a hairline divider. Trigger: `:focus-visible`.

## Behavior

- **Pages of three rows.** A page is always exactly three rows; the final page pads with empty space rather than collapsing.
- **Horizontal scroll-snap.** `scroll-snap-type: x mandatory`; each page declares `scroll-snap-align: start`.
- **Next-page peek.** Pager bleeds out by `sys.layout.container.md` via negative margin. Page basis composes inter-page gap (`inline.xl`) plus visible peek (`inline.md` = 8px) in one `calc`. Peek is the only swipe affordance.
- **Toggle commits in place.** State is owned by the consumer — `active` and `onToggle` forward per row through `items`.
