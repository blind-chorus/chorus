# Suggestion list

A vertically-stacked block of channel recommendations rendered as a swipeable pager. One page shows three rows that follow the [list/entry](../list/entry.md) visual contract at the `xlarge` rung (56px [Thumbnail](../thumbnail/thumbnail.md) + identity group of label + stacked `secondary` follower count + `description` separated by `ref.space.25` (2) + trailing [Toggle Button](../button/toggle.md) flipping between "Follow" and "Following"); the next page peeks at the trailing edge to invite the swipe. Anatomy is entity-agnostic — channels, people, companies, topics all share the same shape.

**Layout inset.** `full-bleed` — sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge. Container pays its own `24px block / 16px inline` padding and the pager bleeds via negative margin to expose the next-page peek; do **not** wrap in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

A two-page list (six channels) with a "See all" action in the header.

```preview
suggestion-list/default
---
import { SuggestionList } from '@blind-dsai/ui';

<SuggestionList
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

## Use cases

### Without header action

The header collapses to just a section label — no trailing "See all" link. Reach for it when there's no broader index page to route to.

```preview
suggestion-list/no-header-action
---
import { SuggestionList } from '@blind-dsai/ui';

<SuggestionList
  label="People you may know"
  items={[
    { value: 'jordan',  name: 'Jordan Lee',     followers: '342 Followers',  description: 'PM at a logistics startup. Mostly here for the threads on roadmap reviews.', thumbnail: { alt: 'Jordan Lee' } },
    { value: 'taylor',  name: 'Taylor Brooks',  followers: '1.1K Followers', description: 'Frontend engineer. Writes about the bits between the framework and the user.', thumbnail: { alt: 'Taylor Brooks' } },
    { value: 'morgan',  name: 'Morgan Park',    followers: '512 Followers',  description: 'Designer-turned-PM. Notes on the handoff layer.', thumbnail: { alt: 'Morgan Park' } },
  ]}
/>
```

### No header

Omit both `label` and `headerAction` — the header row is suppressed entirely and the pager sits flush against the surface's block padding. Reach for it when the surrounding screen already provides the heading. Pair with `aria-label` to keep the swipeable rail named for assistive tech.

```preview
suggestion-list/no-header
---
import { SuggestionList } from '@blind-dsai/ui';

<SuggestionList
  aria-label="Recommended channels"
  items={[
    { value: 'sourdough', name: 'Sourdough Bakers', followers: '12.4K Followers', description: 'Open-crumb obsession, cold-proof timing, starter help.', thumbnail: { alt: 'Sourdough Bakers' } },
    { value: 'indiedev',  name: 'Indie Game Devs',  followers: '8,210 Followers', description: 'Shipping logs, postmortems, marketing on a budget.',     thumbnail: { alt: 'Indie Game Devs' } },
    { value: 'plants',    name: 'Plant People',     followers: '21.7K Followers', description: 'Houseplant troubleshooting and propagation threads.',     thumbnail: { alt: 'Plant People' } },
  ]}
/>
```

## Slots

- **container** — `surface` block with 24px block / 16px inline padding. Holds the header above the pager.
- **header** — single row at the top; section label leading, optional text-link action trailing. Anchored outside the pager.
- **label** — section title. `heading.md` (20px / Semibold) / `onSurface`.
- **headerAction** *(optional)* — [`xsmall` Text Button](../button/text.md), `accent` appearance. Renders as `<a>` when `href` is set.
- **pager** — horizontally-scrolling track with mandatory inline scroll-snap; native scrollbar hidden. Next page peeks at the trailing edge.
- **page** — one swipe target. Vertical stack of exactly three rows.
- **row** — channel suggestion rendered as a [list/entry](../list/entry.md)-shaped row at the `xlarge` rung (56 Thumbnail). Each item descriptor (`name` / `followers` / `description` / `thumbnail` / `active` / `onToggle`) maps to the entry contract (`label` / `secondary` / `description` / `thumbnail` / `trailingIcon`). The row itself is not clickable — its body is presentational. SuggestionList wraps the row with its own bottom-padding + hairline divider (the text-column-anchored rule that ties the divider's left edge to the start of the text column).

## Anatomy

| Slot           | Token bindings |
|----------------|----------------|
| container      | `surface` fill, 24px block / 16px inline padding, vertical stack |
| header         | Flex row, items centred, `space-between`. Container stack (`sys.layout.stack.lg` = 24px) separates from pager. |
| label          | `heading.md` / Semibold / `onSurface` |
| headerAction   | `xsmall` [Text Button](../button/text.md), `accent` appearance |
| pager          | Horizontal scroll, `scroll-snap-type: x mandatory`, scrollbar hidden; `sys.layout.inline.xl` (16/24px) gap; bleeds via `margin-right: -1 × sys.layout.container.md` |
| page           | `flex: 0 0 calc(100% - sys.layout.inline.xl - sys.layout.inline.md)` so the next page leading edge shows by 8px; `scroll-snap-align: start`; `sys.layout.stack.sm` (12px) between rows |
| row            | [list/entry](../list/entry.md)-shaped row at `xlarge` rung — 56 avatar, `inline.lg` gap, label.md primary / caption.md `secondary` + `description`. SuggestionList adds: 12px bottom padding + `::after` divider 1px / `outlineVariant` left-anchored to the text column (`ref.space.700` 56 + `inline.lg` 12 = 68px from row left). |
| trailingAction | [Toggle Button](../button/toggle.md), `variant="toggle"` — composed into the row's `trailingIcon` slot. |

## States

Container has no interactive state. Each row's only interactive surface is its **trailingAction** — a Toggle Button obeying the [Toggle Button](../button/toggle.md) state contract. Row body is presentational; tapping the row does not route. The **headerAction** is an `xsmall` Text Button (rendered as `<a>` when `href` is set).

## Focus indicator

Row body is presentational; the only row-level focus target is the trailing Toggle Button (Outward ring). headerAction also paints its own Outward ring. Composition for any future row-level focus target: Inward — rows tile with a hairline divider. Trigger: `:focus-visible`.

## Behavior

- **Header is optional.** When both `label` and `headerAction` are omitted, the header row is suppressed entirely and the pager rides flush against the surface's block padding. Same contract as [Carousel](../carousel/carousel.md) — omit when the surrounding screen already names the rail.
- **Pages of three rows.** A page is exactly three rows; the final page pads with empty space rather than collapsing.
- **Horizontal scroll-snap.** `scroll-snap-type: x mandatory`; each page declares `scroll-snap-align: start`.
- **Next-page peek.** Pager bleeds out by `sys.layout.container.md` via negative margin. Page basis composes inter-page gap (`inline.xl`) plus visible peek (`inline.md` = 8px) in one `calc`.
- **Toggle commits in place.** State is owned by the consumer — `active` and `onToggle` forward per row through `items`.
- **Entity-agnostic anatomy.** Same row shape carries channels, people, companies, or topics.
