# Post carousel

Sub-component of the [Section](./section.md) family. A horizontally-scrolling pager of up to 5 compact post cards. Surfaces a curated set of popular posts or gives paid / verified accounts priority placement inside the feed column the [Post](../feed/post.md) card lives in. The section heading and trailing `See all` link live on the [Section](./section.md) wrapper — PostCarousel is the *content* only.

## Default

The base composition — header, three cards, pagination dots.

```preview
section/post-carousel-default
---
import { Section, PostCarousel } from '@blind-dsai/ui';

<Section
  label="Trending right now"
  headerAction={{ label: 'See all', href: '#' }}
>
<PostCarousel
  items={[
    {
      avatar: { src: '/placeholder.png', alt: 'Channel' },
      channel: 'Engineering',
      verified: true,
      followAction: true,
      title: 'Which cushion brand still works on combo skin in summer?',
      body: 'Slightly dehydrated combo skin — coverage is nice but not required. Anything that holds for a workday without sliding off? Pore-blurring a plus.',
      mention: '@beauty, @skincare-talk',
      views: '5K',
    },
    {
      avatar: { src: '/placeholder.png', alt: 'Channel' },
      channel: 'Compensation',
      verified: true,
      followAction: true,
      title: 'L5 → L6 promo packet review — what worked, what nearly killed it',
      body: 'I shipped two cross-team launches in the year, but my packet still came back with 'scope of influence unclear' twice before it cleared. Sharing the rewrites.',
      mention: '@career, @big-tech',
      views: '12K',
    },
    {
      avatar: { src: '/placeholder.png', alt: 'Channel' },
      channel: 'Plant People',
      verified: false,
      followAction: true,
      title: 'Monstera dropping aerial roots — repot or train?',
      body: 'Two-year-old monstera, roots crawling out of the drainage holes. Light and watering are dialed in. Looking for the lazy-but-right answer.',
      mention: '@plant-parents',
      views: '3K',
    },
  ]}
/>
</Section>
```

## Slots

- **container** — wraps the pager and pagination dots. No fill / padding — the surrounding [Section](../section/section.md) provides the page-region chrome.
- **pager** — horizontal scroll-snap track of cards. `scroll-snap-type: x mandatory`; native scrollbar hidden.
- **card** — one compact post card per page.
  - **avatar** — channel / author avatar; rendered by the [Thumbnail](../thumbnail/thumbnail.md) component at `size={40}`. Every Thumbnail prop (`src`, `alt`, `updateDot`, `logoBadge`) is forwarded verbatim — the carousel does not paint its own circular crop or image-area fallback.
  - **verified** *(optional)* — inline `VerifiedFillIcon` at `sys.icon.md`, painted in `sys.color.primary` (resolves to `ref.palette.blue.500`). **Sits to the LEFT of the channel name** so the reader's eye lands on the trust signal first, then the name.
  - **channel** — channel / author name; `sys.typo.label.md` / Semibold / `sys.color.onSurface`.
  - **followAction** *(optional)* — trailing [Text Button](../button/text.md) (`size={'xsmall'}`). Inactive (`Follow`) uses `appearance={'accent'}` per the link-affordance rule; active (`Following`) flips to `appearance={'default'}` so the followed state recedes. The carousel does not paint its own follow chrome — every state binding lives on the Text Button family.
  - **title** — post title; `sys.typo.label.md` / Semibold / `sys.color.onSurface`. Single line, truncates.
  - **body** — post excerpt; `sys.typo.body.sm` / Regular / `sys.color.onSurfaceVariant`. Three-line clamp.
  - **mention** *(optional)* — tap-anywhere mention / tag line; `sys.typo.body.sm` / `sys.color.primary` (not italic).
  - **footer** — leading 'See more' [Text Button](../button/text.md) (`size={'xsmall'}`, `appearance={'secondary'}`) + trailing view count (`ViewIcon` at `sys.icon.md` + count, non-interactive `<span>`).
- **pagination** — one dot per card. Active dot paints `sys.color.onSurface`; rest paint `sys.color.outlineVariant`. Decorative (`aria-hidden`).

## Anatomy

| Slot              | Token bindings |
|-------------------|----------------|
| container         | No fill / padding of its own — surrounding [Section](../section/section.md) provides the chrome; `sys.layout.stack.md` pager→dots gap |
| pager             | `gap: sys.layout.inline.md`, negative trailing margin = `sys.layout.container.md` so the peek isn't clipped, `scroll-snap-type: x mandatory`, `scrollbar-width: none` |
| card              | `flex: 0 0 calc(100% - sys.layout.inline.md - ref.space.500)` — the 40px term is the guaranteed peek; `sys.color.surface` fill, `sys.radius.md`, `sys.borderWidth.hairline sys.color.outlineVariant` outline (inset box-shadow, no layout cost), `sys.layout.container.md` padding, `sys.layout.stack.sm` between blocks, `scroll-snap-align: start` — sticks to the pager's leading edge after every swipe |
| header            | Row: avatar + verified mark + name + spacer + follow action; `align-items: center`; `sys.layout.inline.md` gap |
| avatar            | [Thumbnail](../thumbnail/thumbnail.md) `size={40}` — delegated verbatim, including Thumbnail's image-area fallback |
| verified          | `VerifiedFillIcon` at `sys.icon.md`, `sys.color.primary` (resolves to `ref.palette.blue.500`); leading position inside the channel-row |
| channel           | `sys.typo.label.md`, `sys.color.onSurface`, single line truncate; sits to the right of `verified` |
| followAction      | [Text Button](../button/text.md) `size={'xsmall'}`, `appearance={'accent'}` (inactive — link-affordance) → `appearance={'default'}` (active — recedes); all state tokens delegate to the Text Button family |
| title             | `sys.typo.label.md`, `sys.color.onSurface`, single line truncate |
| body              | `sys.typo.body.sm`, `sys.color.onSurfaceVariant`, three-line clamp |
| mention           | `sys.typo.body.sm`, `sys.color.primary` |
| footer            | Row: leading 'See more' Text Button (`xsmall` / `secondary`) + trailing view count `<span>`; `justify-content: space-between` |
| pagination dot    | 6×6, `sys.radius.full`; active `sys.color.onSurface`, inactive `sys.color.outlineVariant`; `sys.layout.inline.sm` row gap |

## Sizes

A single rung. The carousel stretches to its column width (`width: 100%`); on web a feed column typically caps at `comp-content-max`. Card basis is computed from the pager's inner width, so the peek width holds across breakpoints.

## States

PostCarousel is not itself interactive — commit lives in the header action, each card's follow action / more link, and any card-level `onClick`. Each follows its own spec's state contract. The carousel surface has no hover / pressed / focused treatment.

## Focus indicator

Inward — cards tile inside a horizontal scroll viewport with hairline outlines; an outward ring would collide with the next-card peek. Each focusable child paints its own ring per its spec.

## Behavior

- **Max 5 cards.** Items beyond index 4 are silently dropped (`items.slice(0, 5)`) so editorial / ops mistakes never blow out the section.
- **Header anatomy delegates to SuggestionList.** The label and headerAction bindings are the same family contract as [SuggestionList](../suggestion-list/suggestion-list.md) — retune there, not here.
- **One card per page, scroll-snap.** `scroll-snap-type: x mandatory`; each card declares `scroll-snap-align: start`. The pager bleeds out by `sys.layout.container.md` on the trailing edge so the next-card peek is never clipped.
- **Guaranteed 40px peek.** The visible width of the next card at the trailing edge is pinned to `ref.space.500` (40px) — a raw `ref.space.*` step rather than a `sys.layout.*` rung so the visibility floor is fixed-pixel and does not shift at the responsive breakpoint. Card basis is `calc(100% - sys.layout.inline.md - ref.space.500)`, so the inter-card gap plus the peek subtract from the pager's inline space in lock-step.
- **Sticks to the leading padding on swipe.** After every swipe, the snapped card aligns flush with the container's `sys.layout.container.md` left padding — it 'sticks' to the leading edge of the pager. The trailing edge of the same snap state always holds the 40px peek; the two are one geometry contract, not two independent rules.
- **Pagination dots are decorative.** Dots reflect the scroll position via `IntersectionObserver` on the snap targets — tapping a dot does not scroll. The active dot paints `sys.color.onSurface`; the rest paint `sys.color.outlineVariant`.
- **Cards route via `onClick`.** When an item carries `onClick`, the card surface becomes the click target. Header (follow action) and footer (more link) affordances intercept the tap so each routes independently.
- **Insertion is editorial.** Editorial / ops control inserts the carousel between regular Feed cards according to placement policy — the component does not own that decision.
