# Profile carousel

Sub-component of the [Section](./section.md) family. A horizontally-scrolling rail of fixed-width (176px) profile cards — channels, user profiles, or company channels grouped under a single editorial heading. Each card carries a cover band, a 64-rung [Thumbnail](../thumbnail/thumbnail.md) avatar overlapping the cover, an entity name + follower count, a metrics row or two-line description, and a trailing full-width follow [Toggle Button](../button/text.md). The section heading and `See all` link live on the [Section](./section.md) wrapper — ProfileCarousel is the *content* only.

## Default

The base composition — three profile cards under a Section heading.

```preview
section/profile-carousel-default
---
import { Section, ProfileCarousel } from '@blind-dsai/ui';

<Section
  label="Hot companies right now"
  headerAction={{ label: 'See all', href: '#' }}
>
  <ProfileCarousel
    items={[
      {
        avatar: { src: '/blind_logo_red.png', alt: 'Amazon' },
        name: 'Amazon',
        followers: '1,678 followers',
        metrics: [
          { icon: 'star', value: '4.1' },
          { icon: 'pulse', value: '81.1' },
          { icon: 'thumb', value: '81%' },
        ],
      },
      {
        avatar: { src: '/blind_logo_red.png', alt: 'Tesla' },
        name: 'Tesla',
        followers: '1.4K followers',
        metrics: [
          { icon: 'star', value: '4.7' },
          { icon: 'pulse', value: '86' },
          { icon: 'thumb', value: '85.3%' },
        ],
        followed: true,
      },
      {
        avatar: { src: '/blind_logo_red.png', alt: 'Stripe' },
        name: 'Stripe',
        followers: '2.1K followers',
        metrics: [
          { icon: 'star', value: '4.5' },
          { icon: 'pulse', value: '92.4' },
          { icon: 'thumb', value: '88%' },
        ],
      },
    ]}
  />
</Section>
```

## Use cases

### With description

The metrics row swaps out for a two-line description paragraph. Use this for editorial collections where the value of each profile is best explained in copy (channel topic, hot pitch) rather than numeric signals. The description block is fixed to the same two-line height as the metrics row, so cards stay flush across both modes even when a description spills past two lines and clamps with an ellipsis.

```preview
section/profile-carousel-with-description
---
import { Section, ProfileCarousel } from '@blind-dsai/ui';

<Section
  label="Recommended channels"
  headerAction={{ label: 'See all', href: '#' }}
>
  <ProfileCarousel
    items={[
      {
        avatar: { src: '/blind_logo_red.png', alt: 'Engineering' },
        name: 'Engineering',
        followers: '12.4K followers',
        description: 'Hands-on threads about systems, infra, and the work behind the launch.',
      },
      {
        avatar: { src: '/blind_logo_red.png', alt: 'Compensation' },
        name: 'Compensation',
        followers: '8.1K followers',
        description: 'Salary checks, offer evaluations, and the quiet math of staying versus leaving — the channel that runs longer than any single conversation can.',
        followed: true,
      },
      {
        avatar: { src: '/blind_logo_red.png', alt: 'Career' },
        name: 'Career',
        followers: '5.3K followers',
        description: 'Promotion packets, scope debates, and the rewrites that actually cleared.',
      },
    ]}
  />
</Section>
```

## Slots

- **container** — wraps the pager and pagination dots. No fill / padding — the surrounding [Section](./section.md) provides the chrome.
- **pager** — horizontal scroll-snap track. `scroll-snap-type: x mandatory`; native scrollbar hidden.
- **card** — one profile card per page; fixed at **176px** wide.
  - **cover** — top band; `sys.color.surfaceContainerHigh` fill, 88px tall, holds the Blind logotype watermark behind the avatar.
  - **avatar** — [Thumbnail](../thumbnail/thumbnail.md) `size={64}`, centered and overlapping the cover band's bottom edge.
  - **name** — entity name; `sys.typo.label.md` / Semibold / `sys.color.onSurface`; centered, single line truncate.
  - **followers** — follower count; `sys.typo.caption.md` / `sys.color.onSurfaceVariant`; centered.
  - **metrics** *(optional)* — row of `icon + value` chips: `star → StarFillIcon (ref.palette.yellow.500)`, `pulse → PulseFillIcon (sys.color.success)`, `thumb → ThumbUpFillIcon (sys.color.primary)`. Mutually exclusive with `description`.
  - **description** *(optional)* — two-line clamped paragraph that replaces the metrics row when present. The block height is fixed to two lines of `sys.typo.caption.md` regardless of how much copy lands, so card height stays consistent across cards that carry metrics and cards that carry copy.
  - **followAction** — full-width [Toggle Button](../button/text.md) (`variant={'toggle'}`); `Follow` (inactive) / `Following` (active).
- **pagination** — one dot per card. Active dot paints `sys.color.onSurface`; rest paint `sys.color.outlineVariant`. Decorative.

## Anatomy

| Slot           | Token bindings |
|----------------|----------------|
| pager          | `gap: sys.layout.inline.md`, negative trailing margin = `sys.layout.container.md`, `scroll-snap-type: x mandatory` |
| card           | Fixed `width: 176px`, `sys.color.surface` fill, `sys.radius.md`, inset hairline outline, `scroll-snap-align: start` |
| cover          | 88px tall, `sys.color.surfaceContainerHigh`, watermark centered at low opacity |
| avatar         | [Thumbnail](../thumbnail/thumbnail.md) `size={64}`, vertical center on cover's bottom edge |
| name           | `sys.typo.label.md`, `sys.color.onSurface`, centered |
| followers      | `sys.typo.caption.md`, `sys.color.onSurfaceVariant`, centered |
| metrics row    | `sys.layout.inline.md` gap, centered. Fixed-height slot — `calc(sys.typo.caption.md.size * sys.typo.caption.md.line * 2)` so the row always reserves two lines of `caption.md` regardless of content. |
| metric chip    | `sys.icon.md` glyph + `sys.typo.label.sm` value; star → `StarFillIcon` (`ref.palette.yellow.500`), pulse → `PulseFillIcon` (`sys.color.success`), thumb → `ThumbUpFillIcon` (`sys.color.primary`) |
| description    | `sys.typo.caption.md` / `sys.color.onSurfaceVariant`, centered, two-line clamp with trailing ellipsis. Two-layer DOM — an outer container owns the same fixed-height slot as `metrics row` (min/max-height = 2 caption.md lines); the inner `<p>` owns the `-webkit-line-clamp: 2` truncation. The split sidesteps a Chrome quirk where `display: -webkit-box` and an explicit `height` on one element silently break the third-line clip. |
| followAction   | [Toggle Button](../button/text.md) (Chip-toggle anatomy), stretched to full card width |
| pagination dot | 6×6, `sys.radius.full`; active `sys.color.onSurface`, inactive `sys.color.outlineVariant` |

## States

ProfileCarousel is not itself interactive — commit lives in each card's Toggle Button follow affordance (and the optional card-level `onClick`). Each follows its own spec's state contract.

## Behavior

- **Max 5 cards.** Items beyond index 4 are silently dropped.
- **Fixed 176px card width.** Cards do not reflow to the viewport — the rail always paints the same footprint and scrolls horizontally.
- **Header lives on Section.** ProfileCarousel does not paint its own section heading or 'See all' link.
- **Sticks to the Section's left padding on swipe.** Same geometry contract as [Post carousel](./post-carousel.md) — `scroll-snap-align: start` + no leading margin.
- **Guaranteed 40px peek.** A minimum of `ref.space.500` (40px) of the next card is always visible at the trailing edge.
- **Follow toggle commits in place.** Tapping `Follow` flips the card's Toggle Button to `Following` and stays there. Consumer owns state via `items[i].followed` + `onFollowChange`.
