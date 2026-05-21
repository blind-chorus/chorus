# Ad Feed

A sponsored placement that rides the same scrolling column as [Feed](../feed/feed.md). The header trades a channel/author row for a brand row (avatar + brand name + tag-line subtitle + a trailing close affordance), the body block stays the same shape as Feed's title + excerpt, the thumbnail expands into a full-width hero media block, and the footer collapses to a single full-width call-to-action. There is no engagement row — ads are not authored content.

## Default

The base composition — brand row with dismiss, headline, body excerpt, hero media, and a primary CTA.

```preview
ad-feed/default
---
import { AdFeed } from '@blind-dsai/ui';

<AdFeed
  brand={{
    name: 'Brand Name',
    subtitle: 'Blind Company Reviews',
    avatar: { alt: 'Brand logo' },
  }}
  onDismiss={() => {}}
  title="AD title"
  body="Here's feed text. Here's feed text. Here's feed text. Here's feed text."
  media={{
    alt: 'Read unfiltered, verified company reviews',
    background: '#3DB1A3',
  }}
  cta={{ label: 'Color Button' }}
/>
```

## Use cases

### Minimal

Body copy is optional. The brand row sits directly above the hero block when both `title` and `body` are absent.

```preview
ad-feed/minimal
---
import { AdFeed } from '@blind-dsai/ui';

<AdFeed
  brand={{
    name: 'Brand Name',
    avatar: { alt: 'Brand logo' },
  }}
  media={{ alt: 'Promotional banner', background: '#3DB1A3' }}
  cta={{ label: 'Learn more' }}
/>
```

### Without dismiss

Omit `onDismiss` for placements without a user-dismiss path. The brand row reads as a flat strip, no trailing affordance.

```preview
ad-feed/no-dismiss
---
import { AdFeed } from '@blind-dsai/ui';

<AdFeed
  brand={{
    name: 'Brand Name',
    subtitle: 'Sponsored',
    avatar: { alt: 'Brand logo' },
  }}
  title="Headline that sells the offer"
  body="A short two-line excerpt explains the offer just enough for the reader to decide whether to commit."
  media={{ alt: 'Hero media', background: '#3DB1A3' }}
  cta={{ label: 'Get the app' }}
/>
```

### Within My Page

The My Page-only placement — drop `cta` and the foot button collapses out of the layout. The entire card is the affordance: the surrounding My Page surface routes the tap, so stacking a redundant full-width Standard Button on top of an already-actionable row would compete with the surface's own navigation. Reach for this shape only inside the My Page route; every other in-feed placement keeps the CTA.

```preview
ad-feed/my-page
---
import { AdFeed } from '@blind-dsai/ui';

<AdFeed
  brand={{
    name: 'Brand Name',
    subtitle: 'Blind Company Reviews',
    avatar: { alt: 'Brand logo' },
  }}
  onDismiss={() => {}}
  title="AD title"
  body="Here's feed text. Here's feed text. Here's feed text. Here's feed text."
  media={{ alt: 'Read unfiltered, verified company reviews', background: '#3DB1A3' }}
/>
```

## Slots

- **brand** — leading row: 32-rung [Thumbnail](../thumbnail/thumbnail.md), brand name (`label.md` / `onSurface`), and optional subtitle (`caption.md` / `onSurfaceVariant`) stacked underneath.
- **dismiss** *(optional)* — trailing 16px close icon, only rendered when `onDismiss` is wired.
- **title** *(optional)* — single-line headline (`heading.md` / `onSurface`).
- **body** *(optional)* — two-line clamped excerpt (`body.sm` / `onSurfaceVariant`).
- **media** — hero block under the body. Fills the card's inline width at a 16:10 aspect ratio, `radius.md`. Optional `media.background` paints a flat fill behind the image for brand-tinted placements.
- **cta** *(optional)* — full-width [Standard Button](../button/standard.md) at the foot. `appearance` defaults to `primary`. Omitted on placements where the surrounding surface already routes the tap (see *Within My Page* below).

## Anatomy

| Slot             | Token bindings |
|------------------|----------------|
| container        | `surface` fill, `radius.md`, `sys.layout.container.lg` (24px mobile / 32px web) block × `sys.layout.container.md` (16px) inline padding, `sys.layout.stack.md` between blocks |
| brand row        | Avatar + text column as a row, `sys.layout.inline.md` (8px) gap, `align-items: center` |
| brand avatar     | [Thumbnail](../thumbnail/thumbnail.md) `size={32}` — delegated verbatim |
| brand name       | `sys.typo.label.md` (14 / Semibold), `onSurface` |
| brand subtitle   | `sys.typo.caption.md` (12 / Regular), `onSurfaceVariant` |
| dismiss          | 16px `CloseIcon` inside a 24-rung hit area, `onSurfaceVariant` glyph, no chrome at rest |
| title → body     | 8px vertical gap (`sys.layout.stack.xs`) |
| title            | `heading.md` (20 / Semibold), `onSurface`, single-line truncate |
| body             | 14 / Regular, `onSurfaceVariant`, two-line clamp |
| media            | Full inline width, 16:10 aspect ratio, `sys.radius.md`. Painted with `media.background` when set; otherwise `surfaceContainerHigh` fallback. |
| cta              | [Standard Button](../button/standard.md) — `fullWidth`, `medium`, `primary` by default. Optional — drops out of the layout entirely when omitted. |

## Sizes

A single rung. The card stretches to its column (`width: 100%`); on web an ad column inherits the same `comp-content-max` cap as Feed.

## States

AdFeed is not itself interactive — commit lives in the dismiss and CTA. The card surface has no hover/pressed/focused treatment.

## Focus indicator

AdFeed is not a focus target; each focusable child (dismiss button, CTA) paints its own ring per its spec.

## Behavior

- **Slot omission collapses without leaving a gap.** `title`, `body`, `media.src`, and `dismiss` are all opt-in — when any is absent the layout reflows without reserved whitespace.
- **Truncation, not wrap.** `title` truncates; `body` clamps to two lines.
- **Dismiss is opt-in.** The trailing X only renders when `onDismiss` is wired. Ad placements without a user-dismiss path render the brand row at one column-of-text wide.
- **At most one CTA.** AdFeed has no engagement row — ads are not authored content. The footer, when present, is a single full-width Standard Button.
- **`cta` is omitted on My Page.** Inside the My Page surface the entire card is the affordance and the parent route handles the tap; stacking a Standard Button on top would duplicate the commit. Every other in-feed placement keeps the CTA.
