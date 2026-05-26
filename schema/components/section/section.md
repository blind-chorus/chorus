# Section

Page-region wrapper for editorial collections — a labelled block with a leading heading and an optional trailing `See all` link, hosting a horizontal carousel underneath. Section owns the chrome (surface, padding, header anatomy); each carousel sub owns only its pager + cards.

- **[Post carousel](./post-carousel.md)** — a swipeable rail of compact post cards. Surfaces a curated set of popular posts or gives paid / verified accounts priority placement inside the feed column.
- **[Profile carousel](./profile-carousel.md)** — a swipeable rail of profile-style cards (channels, user profiles, company channels). Surfaces "Hot companies right now", recommended channels, or any profile-shaped collection.

Both subs share the same pager geometry — a `ref.space.500` (40px) trailing peek and a leading-padding sticky snap anchor — so editorial collections of posts and profiles tile cleanly side by side.

**Reach for this when** a finite, curated set of cards belongs together under a labelled heading and reads as a horizontal swipeable rail — "Popular posts this week", "Recommended channels", "Hot companies right now". **Skip when** the collection is an open-ended scrolling stream of authored items (use [Feed](../feed/feed.md)), a vertical list of same-kind rows (use [List](../list/list.md)), or a channel directory that needs the channel-specific row chrome (use [SuggestionList](../suggestion-list/suggestion-list.md)). Pick the sub by the card shape: post cards → [Post carousel](./post-carousel.md); profile / channel / company cards → [Profile carousel](./profile-carousel.md).

## Cross-sub contract

### Header anatomy

Every Section paints the same heading + optional trailing link, regardless of the hosted carousel:

- **Label** — `sys.typo.heading.md` / Semibold / `sys.color.onSurface`. Leading position.
- **headerAction** *(optional)* — trailing [Text Button](../button/text.md) (`size={'xsmall'}`, `appearance={'accent'}`) per the link-affordance rule.

This header is the family-wide source of truth; [SuggestionList](../suggestion-list/suggestion-list.md) paints the same header internally. Retune bindings here.

### Surface + padding

Both subs compose inside a single Section surface: `sys.color.surface` fill, `sys.layout.container.lg` block × `sys.layout.container.md` inline padding, `sys.layout.stack.lg` between header and carousel body. The carousel sub itself paints no surface and no padding.

### Pager geometry

Both subs use the same pager: `scroll-snap-type: x mandatory`, `scroll-snap-align: start` on each card, trailing negative margin = `sys.layout.container.md` so the next-card peek isn't clipped, guaranteed `ref.space.500` (40px) peek at the trailing edge, leading-padding sticky anchor after every swipe.

### Card count

Each sub renders **at most 5 cards** — `items.slice(0, 5)`. Editorial / ops mistakes never blow out the section.

## Sub-components

- **[Post carousel](./post-carousel.md)** — compact post cards for curated / priority placements.
- **[Profile carousel](./profile-carousel.md)** — fixed-shape profile cards for follow-able entities.
