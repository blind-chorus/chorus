# Post carousel

Sub-component of the [Section](./section.md) family. Horizontally-scrolling pager of up to 5 compact post cards — surfaces curated popular posts or gives paid / verified accounts priority placement inside the [Post](../feed/post.md) feed column. The section heading and `See all` link live on the [Section](./section.md) wrapper — PostCarousel is the *content* only.

**Layout inset.** `full-bleed` — sits as a direct child of the page shell (typically inside a [Section](./section.md)). The rail pays its own inline padding via `layout.container.*` and lets the first / last card flush to the page edge so the horizontal-scroll affordance reads cleanly; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Section header above three cards with verified marks, follow actions, and pagination dots.

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
      body: 'I shipped two cross-team launches in the year, but my packet still came back with "scope of influence unclear" twice before it cleared. Sharing the rewrites.',
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

## Use cases

### Editorial cards (no follow, no verified)

Cards drop `verified` and `followAction` — the header collapses to avatar + channel name. Reach for it on editorial collections where the card is informational only (round-ups, archives, "what we're reading"); the surface should not invite a per-card commit.

```preview
section/post-carousel-editorial
---
import { Section, PostCarousel } from '@blind-dsai/ui';

<Section label="Editor picks" headerAction={{ label: 'See all', href: '#' }}>
  <PostCarousel
    items={[
      { avatar: { src: '/placeholder.png', alt: 'Channel' }, channel: 'Career',       title: 'The quiet math of staying versus leaving',                body: 'Salary checks, offer evaluations, and the long thread that runs longer than any single conversation can.',                       views: '18K' },
      { avatar: { src: '/placeholder.png', alt: 'Channel' }, channel: 'Compensation', title: 'Equity refresh negotiations — what actually moves',       body: 'A read on the conversations that get an actual refresh on the calendar versus the ones that get a polite no.',                     views: '9K'  },
      { avatar: { src: '/placeholder.png', alt: 'Channel' }, channel: 'Engineering',  title: 'The migration that finally landed after three quarters', body: 'Internal postmortem turned editorial — the scaffolding that held the rewrite together when the timeline did not.',                 views: '14K' },
    ]}
  />
</Section>
```

## Slots

- **container** — wraps pager + pagination dots. No fill / padding — the surrounding [Section](../section/section.md) provides the chrome.
- **pager** — horizontal scroll-snap track. `scroll-snap-type: x mandatory`; native scrollbar hidden.
- **card** — one compact post card per page; outline-only surface.
  - **avatar** — [Thumbnail](../thumbnail/thumbnail.md) `size={40}`, every prop (`src`, `alt`, `updateDot`, `logoBadge`) forwarded verbatim.
  - **verified** *(optional)* — `VerifiedFillIcon` (`sys.icon.md`, `sys.color.primary`) **to the LEFT of the channel name** so the trust signal reads first.
  - **channel** — channel / author name. `sys.typo.label.md` / Semibold / `sys.color.onSurface`.
  - **followAction** *(optional)* — trailing [Text Button](../button/text.md) (`xsmall`). `accent` inactive (link-affordance) → `default` active (recedes). Carousel doesn't paint its own follow chrome.
  - **title** — `sys.typo.label.md` / Semibold / `sys.color.onSurface`. Single line, truncates.
  - **body** — `sys.typo.body.sm` / `sys.color.onSurfaceVariant`. Three-line clamp.
  - **mention** *(optional)* — `sys.typo.body.sm` / `sys.color.primary` (not italic).
  - **footer** — leading 'See more' [Text Button](../button/text.md) (`xsmall` / `secondary`) + trailing view count (`EyeIcon` + count `<span>`).
- **pagination** — one dot per card; active `sys.color.onSurface`, rest `sys.color.outlineVariant`. Decorative (`aria-hidden`).

## Anatomy

| Slot              | Token bindings |
|-------------------|----------------|
| container         | No fill / padding — surrounding [Section](../section/section.md) provides the chrome; `sys.layout.stack.md` pager→dots gap |
| pager             | `gap: sys.layout.inline.md`, negative trailing margin = `sys.layout.container.md`, `scroll-snap-type: x mandatory`, `scrollbar-width: none` |
| card              | `flex: 0 0 calc(100% - sys.layout.inline.md - ref.space.500)`; `sys.color.surface` fill, `sys.radius.md`, `sys.borderWidth.hairline sys.color.outlineVariant` outline (inset box-shadow), `sys.layout.container.md` padding, `sys.layout.stack.sm` between blocks, `scroll-snap-align: start` |
| header            | Row: avatar + verified mark + name + spacer + follow action; `align-items: center`; `sys.layout.inline.md` gap |
| avatar / verified | [Thumbnail](../thumbnail/thumbnail.md) `size={40}` delegated verbatim · `VerifiedFillIcon` at `sys.icon.md` / `sys.color.primary` (resolves to `ref.palette.blue.500`), leading of the channel name |
| channel / title   | `sys.typo.label.md`, `sys.color.onSurface`, single-line truncate |
| body / mention    | `sys.typo.body.sm` / `sys.color.onSurfaceVariant` (three-line clamp) · mention in `sys.color.primary` |
| followAction      | [Text Button](../button/text.md) `size={'xsmall'}`, `appearance={'accent'}` inactive → `appearance={'default'}` active; state tokens delegate to Text Button |
| footer            | Row: leading 'See more' Text Button (`xsmall` / `secondary`) + trailing view count `<span>`; `justify-content: space-between` |
| pagination dot    | 6×6, `sys.radius.full`; active `sys.color.onSurface`, inactive `sys.color.outlineVariant`; `sys.layout.inline.sm` row gap |

## Sizes

A single rung. The carousel stretches to its column width (`width: 100%`); on web a feed column typically caps at `comp-content-max`. Card basis is computed from the pager's inner width, so the peek width holds across breakpoints.

## States

PostCarousel is not itself interactive — commit lives in the header action, each card's follow action / more link, and any card-level `onClick`. Each follows its own spec's state contract. The carousel surface has no hover / pressed / focused treatment.

## Focus indicator

Inward — cards tile inside a horizontal scroll viewport with hairline outlines; an outward ring would collide with the next-card peek. Each focusable child paints its own ring per its spec.

## Behavior

- **Max 5 cards.** Items beyond index 4 are silently dropped (`items.slice(0, 5)`).
- **Header anatomy delegates to SuggestionList.** Label + headerAction bindings retune at the [SuggestionList](../suggestion-list/suggestion-list.md) spec.
- **One card per page, scroll-snap.** `scroll-snap-type: x mandatory`; each card declares `scroll-snap-align: start`. Pager bleeds out by `sys.layout.container.md` on the trailing edge so the peek isn't clipped.
- **Guaranteed 40px peek.** Trailing-edge visibility of the next card pins to `ref.space.500` — raw ref step so the floor is fixed-pixel across breakpoints. Card basis is `calc(100% - sys.layout.inline.md - ref.space.500)`. After every swipe, the snapped card aligns flush with the container's left padding; the trailing edge always holds the 40px peek.
- **Pagination dots are decorative.** Dots reflect scroll position via `IntersectionObserver`; tapping a dot does not scroll. Active dot paints `sys.color.onSurface`, the rest `sys.color.outlineVariant`.
- **Cards route via `onClick`.** When an item carries `onClick`, the card surface becomes the click target; header (follow action) and footer (more link) intercept the tap so each routes independently.
