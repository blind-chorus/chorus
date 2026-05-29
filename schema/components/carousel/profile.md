# Profile carousel

Sub-component of the [Carousel](./carousel.md) family. Horizontally-scrolling rail of fixed-width (176px) profile cards — channels, user profiles, or company channels grouped under a single editorial heading. Each card carries a cover band, an overlapping 64-rung avatar, entity name + follower count, a metrics row or two-line description, and a trailing follow [Toggle Button](../button/text.md).

**Reach for this when** an editorial collection groups follow-able entities under a single heading — hot companies, recommended channels, suggested people. **Skip when** the rail carries content posts ([Post carousel](./post-carousel.md)), the surface needs the full list scanned vertically ([SuggestionList](../suggestion-list/suggestion-list.md) / [DirectoryList](../directory-list/directory-list.md)), or the rung is a label-only nav strip ([AvatarRail](../avatar-rail/avatar-rail.md)).

**Layout inset.** `full-bleed` — sits as a direct child of the page shell so the rail can bleed off the trailing edge into the swipe zone. The rail pays its own `16px inline` padding via `layout.container.*`; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Three profile cards under a Carousel heading (label only).

```preview
carousel/profile-default
---
import { Carousel, ProfileCarousel } from '@blind-dsai/ui';

<Carousel label="Hot companies right now">
  <ProfileCarousel
    items={[
      {
        avatar: { src: '/placeholder.png', alt: 'Amazon' },
        name: 'Amazon',
        followers: '1,678 followers',
        metrics: [
          { icon: 'star', value: '4.1' },
          { icon: 'pulse', value: '81.1' },
          { icon: 'heart', value: '81%' },
        ],
      },
      {
        avatar: { src: '/placeholder.png', alt: 'Tesla' },
        name: 'Tesla',
        followers: '1.4K followers',
        metrics: [
          { icon: 'star', value: '4.7' },
          { icon: 'pulse', value: '86' },
          { icon: 'heart', value: '85.3%' },
        ],
        followed: true,
      },
      {
        avatar: { src: '/placeholder.png', alt: 'Stripe' },
        name: 'Stripe',
        followers: '2.1K followers',
        metrics: [
          { icon: 'star', value: '4.5' },
          { icon: 'pulse', value: '92.4' },
          { icon: 'heart', value: '88%' },
        ],
      },
    ]}
  />
</Carousel>
```

## Use cases

### With header action

Extend the header with a trailing `accent` Text Button when there's an index page to route to. Lifts the `headerAction` prop on the `<Carousel>` wrapper.

```preview
carousel/profile-with-header-action
---
import { Carousel, ProfileCarousel } from '@blind-dsai/ui';

<Carousel label="Hot companies right now" headerAction={{ label: 'See all', href: '#' }}>
  <ProfileCarousel
    items={[
      {
        avatar: { src: '/placeholder.png', alt: 'Amazon' },
        name: 'Amazon',
        followers: '1,678 followers',
        metrics: [
          { icon: 'star', value: '4.1' },
          { icon: 'pulse', value: '81.1' },
          { icon: 'heart', value: '81%' },
        ],
      },
      {
        avatar: { src: '/placeholder.png', alt: 'Tesla' },
        name: 'Tesla',
        followers: '1.4K followers',
        metrics: [
          { icon: 'star', value: '4.7' },
          { icon: 'pulse', value: '86' },
          { icon: 'heart', value: '85.3%' },
        ],
        followed: true,
      },
      {
        avatar: { src: '/placeholder.png', alt: 'Stripe' },
        name: 'Stripe',
        followers: '2.1K followers',
        metrics: [
          { icon: 'star', value: '4.5' },
          { icon: 'pulse', value: '92.4' },
          { icon: 'heart', value: '88%' },
        ],
      },
    ]}
  />
</Carousel>
```

### With description

The metrics row swaps out for a two-line description. Use for editorial collections where the value of each profile is best explained in copy (channel topic, hot pitch) rather than numeric signals. The description block is fixed to the same two-line height as the metrics row, so cards stay flush across both modes even when description copy clamps with an ellipsis.

```preview
carousel/profile-with-description
---
import { Carousel, ProfileCarousel } from '@blind-dsai/ui';

<Carousel label="Recommended channels">
  <ProfileCarousel
    items={[
      {
        avatar: { src: '/placeholder.png', alt: 'Engineering' },
        name: 'Engineering',
        followers: '12.4K followers',
        description: 'Hands-on threads about systems, infra, and the work behind the launch.',
      },
      {
        avatar: { src: '/placeholder.png', alt: 'Compensation' },
        name: 'Compensation',
        followers: '8.1K followers',
        description: 'Salary checks, offer evaluations, and the quiet math of staying versus leaving — the channel that runs longer than any single conversation can.',
        followed: true,
      },
      {
        avatar: { src: '/placeholder.png', alt: 'Career' },
        name: 'Career',
        followers: '5.3K followers',
        description: 'Promotion packets, scope debates, and the rewrites that actually cleared.',
      },
    ]}
  />
</Carousel>
```

## Slots

- **container** — wraps the pager and pagination dots. No fill / padding — the surrounding [Carousel](./carousel.md) provides the chrome.
- **pager** — horizontal scroll-snap track. `scroll-snap-type: x mandatory`; native scrollbar hidden.
- **card** — one profile card per page; fixed at **176px** wide.
  - **cover** — top band; 88px tall image-area slot. Renders an `<img>` defaulting to `/placeholder.png` (universal Chorus placeholder). `object-fit: cover` crops to fill the band; `sys.color.surfaceContainerHigh` underlies as the no-image fallback. Consumers override via `items[i].cover.src`.
  - **avatar** — [Thumbnail](../thumbnail/thumbnail.md) `size={64}` with [`outlined={true}`](../thumbnail/thumbnail.md#with-surface-outline), centered and overlapping the cover band's bottom edge. The 2-token (`sys.borderWidth.thin`) `surface`-tone outset halo separating the circle from the cover image is owned by Thumbnail's outlined case — the carousel forwards the prop instead of painting a halo on its own wrapper.
  - **name** — entity name; `sys.typo.label.md` / Semibold / `sys.color.onSurface`; centered, single line truncate.
  - **followers** — follower count; `sys.typo.caption.md` / `sys.color.onSurfaceVariant`; centered.
  - **metrics** *(optional)* — row of `icon + value` chips: `star → StarFillIcon (sys.color.icon.yellow)`, `pulse → PulseFillIcon (sys.color.success)`, `heart → HeartFillIcon (sys.color.icon.red)`. Mutually exclusive with `description`.
  - **description** *(optional)* — two-line clamped paragraph that replaces the metrics row when present. Block height fixed to two lines of `sys.typo.caption.md` regardless of copy length, so card height stays consistent across metrics-carrying and copy-carrying cards.
  - **followAction** — full-width [Toggle Button](../button/text.md) (`variant={'toggle'}`); `Follow` (inactive) / `Following` (active).
- **pagination** — one dot per card. Active dot paints `sys.color.onSurface`; rest paint `sys.color.outlineVariant`. Decorative.

## Anatomy

| Slot           | Token bindings |
|----------------|----------------|
| pager          | `gap: sys.layout.inline.md`, negative trailing margin = `sys.layout.container.md`, `scroll-snap-type: x mandatory` |
| card           | Fixed `width: 176px`, `sys.color.surface` fill, `sys.radius.md`, inset hairline outline, `scroll-snap-align: start` |
| cover          | 88px tall image-area slot. Default `src` = `/placeholder.png` (universal image placeholder), `object-fit: cover`, `sys.color.surfaceContainerHigh` underlay |
| avatar         | [Thumbnail](../thumbnail/thumbnail.md) `size={64}` `outlined`, vertical center on cover's bottom edge. The 2-token `surface`-tone halo separating the circle from the cover image is painted by Thumbnail's `outlined` case (outset `box-shadow: 0 0 0 sys.borderWidth.thin sys.color.surface`) — wrapper has no halo of its own |
| name           | `sys.typo.label.md`, `sys.color.onSurface`, centered |
| followers      | `sys.typo.caption.md`, `sys.color.onSurfaceVariant`, centered |
| metrics row    | `sys.layout.inline.md` gap, centered. Fixed-height slot — `calc(sys.typo.caption.md.size * sys.typo.caption.md.line * 2)` so the row always reserves two lines of `caption.md` regardless of content. |
| metric chip    | `sys.icon.md` glyph + `sys.typo.label.sm` value; star → `StarFillIcon` (`sys.color.icon.yellow`), pulse → `PulseFillIcon` (`sys.color.success`), heart → `HeartFillIcon` (`sys.color.icon.red`) |
| description    | `sys.typo.caption.md` / `sys.color.onSurfaceVariant`, centered, two-line clamp with trailing ellipsis. Two-layer DOM — outer container owns the same fixed-height slot as `metrics row` (min/max-height = 2 caption.md lines); inner `<p>` owns the `-webkit-line-clamp: 2` truncation. Split sidesteps a Chrome quirk where `display: -webkit-box` and explicit `height` on one element break the third-line clip. |
| followAction   | [Toggle Button](../button/text.md) (Chip-toggle anatomy), stretched to full card width |
| pagination dot | 6×6, `sys.radius.full`; active `sys.color.onSurface`, inactive `sys.color.outlineVariant` |

## States

ProfileCarousel is not itself interactive — commit lives in each card's Toggle Button follow affordance (and the optional card-level `onClick`). Each follows its own spec's state contract.

## Behavior

- **Max 5 cards.** Items beyond index 4 are silently dropped.
- **Fixed 176px card width.** Cards do not reflow to the viewport — the rail always paints the same footprint and scrolls horizontally.
- **Header lives on Carousel.** ProfileCarousel does not paint its own section heading or 'See all' link.
- **Sticks to the Carousel's left padding on swipe.** Same geometry contract as [Post carousel](./post-carousel.md) — `scroll-snap-align: start` + no leading margin.
- **Guaranteed 40px peek.** A minimum of `ref.space.500` (40px) of the next card is always visible at the trailing edge.
- **Follow toggle commits in place.** Tapping `Follow` flips the card's Toggle Button to `Following` and stays there. Consumer owns state via `items[i].followed` + `onFollowChange`.
