# Feed · Ad

Sub-component of the [Feed](./feed.md) family. A sponsored placement that rides the same scrolling column as [Default Feed](./default.md). The header trades a channel/author row for a brand row (32-rung [Thumbnail](../thumbnail/thumbnail.md) + brand name + a `Sponsored` subtitle + a trailing close affordance), the body block stays the same shape as Feed's title + excerpt, and the hero media and CTA are bonded into a single rounded slab at the foot. There is no engagement row — ads are not authored content.

## Default

The base composition — brand row (no dismiss), headline, body excerpt, and a hero + CTA slab. Dismiss is opt-in, so the default placement omits it; the CTA fill is plumbed through with the advertiser's brand Hex via `cta.color`.

```preview
feed/ad-default
---
import { FeedAd } from '@blind-dsai/ui';

<FeedAd
  brand={{
    name: 'Acme Coffee',
    avatar: { src: '...', alt: 'Acme Coffee logo' },
  }}
  title="Your morning brew, on us."
  body="Sign up this week and your first bag of single-origin beans ships free — no subscription required."
  media={{
    src: '...',
    alt: 'A flat-lay of freshly roasted coffee beans',
  }}
  cta={{ label: 'Claim your free bag', color: '#3DB1A3' }}
/>
```

## Use cases

### With dismiss

Wire `onDismiss` to render the trailing close icon for placements that give the reader a user-dismiss path.

```preview
feed/ad-with-dismiss
---
import { FeedAd } from '@blind-dsai/ui';

<FeedAd
  brand={{
    name: 'Lumen Fitness',
    avatar: { src: '...', alt: 'Lumen Fitness logo' },
  }}
  onDismiss={() => {}}
  title="Train smarter, not longer."
  body="Personalized 20-minute workouts that adapt to your recovery — free for the first 30 days, no card required."
  media={{ src: '...', alt: 'An athlete mid-workout in a sunlit studio' }}
  cta={{ label: 'Start your free trial', color: '#5E4BDB' }}
/>
```

## Slots

- **brand** — leading row: 32-rung [Thumbnail](../thumbnail/thumbnail.md) + brand name (`label.md` / `onSurface`) + `Sponsored` subtitle (`caption.md` / `onSurfaceVariant`) stacked underneath. Subtitle defaults to `Sponsored`; consumers may override but cannot drop it.
- **dismiss** *(optional)* — trailing 16px close icon, only rendered when `onDismiss` is wired.
- **title** *(optional)* — single-line headline (`heading.md` / `onSurface`).
- **body** *(optional)* — two-line clamped excerpt (`body.sm` / `onSurfaceVariant`).
- **cta-group** — the foot slab. Hero **media** (16:10) and a full-width [Standard Button](../button/standard.md) sit flush inside a single `radius.md` clip with no internal gap. `cta.color` accepts an advertiser-supplied Hex that swaps the button fill and border; every other token binding stays intact.

## Anatomy

| Slot             | Token bindings |
|------------------|----------------|
| container        | `surface` fill, `radius.md`, `sys.layout.container.lg` (24px mobile / 32px web) block × `sys.layout.container.md` (16px) inline padding, `sys.layout.stack.md` between blocks |
| brand row        | [Thumbnail](../thumbnail/thumbnail.md) + text column as a row, `sys.layout.inline.md` (8px) gap, `align-items: center` |
| brand avatar     | [Thumbnail](../thumbnail/thumbnail.md) `size={32}` — delegated verbatim |
| brand name       | `sys.typo.label.md` (14 / Semibold), `onSurface` |
| brand subtitle   | `sys.typo.caption.md` (12 / Regular), `onSurfaceVariant`. Defaults to `Sponsored`. |
| dismiss          | 16px `CloseIcon` inside a 24-rung hit area, `onSurfaceVariant` glyph, no chrome at rest |
| title → body     | 8px vertical gap (`sys.layout.stack.xs`) |
| title            | `heading.md` (20 / Semibold), `onSurface`, single-line truncate |
| body             | 14 / Regular, `onSurfaceVariant`, two-line clamp |
| cta-group        | `radius.md` (8px) clip wrapping media + CTA, `overflow: hidden`, no internal gap |
| media            | Full inline width, 16:10 aspect ratio, no own radius (the group clips). `surfaceContainerHigh` fallback when no `src`. |
| cta              | [Standard Button](../button/standard.md) — `fullWidth`, `medium`, `primary` by default, **`border-radius: 0`** so the squared bottom edge meets the group's clip. `cta.color` overrides the surface fill with a free-form Hex. |

## Sizes

A single rung. The card stretches to its column (`width: 100%`); on web an ad column inherits the same `comp-content-max` cap as Feed.

## States

FeedAd is not itself interactive — commit lives in the dismiss and CTA. The card surface has no hover/pressed/focused treatment.

## Focus indicator

FeedAd is not a focus target; each focusable child (dismiss button, CTA) paints its own ring per its spec.

## Behavior

- **Brand subtitle is always present.** The literal defaults to `Sponsored` so every placement reads as sponsored content. Consumers may override the copy but cannot omit the row.
- **Hero media and CTA are one slab.** They share a `radius.md` clip with no internal gap; the CTA's own corner radius is zeroed so its squared bottom edge meets the group's outer round.
- **Free-form CTA color.** `cta.color` accepts any Hex string supplied by the ad client. Only the button surface fill and border swap — typography, size, and full-width geometry stay on the Standard Button tokens.
- **Slot omission collapses without leaving a gap.** `title`, `body`, `media.src`, and `dismiss` are all opt-in — when any is absent the layout reflows without reserved whitespace.
- **Truncation, not wrap.** `title` truncates; `body` clamps to two lines.
- **Dismiss is opt-in.** Default placements omit it; the trailing X only renders when `onDismiss` is wired.
- **At most one CTA.** FeedAd has no engagement row — ads are not authored content. The cta-group, when present, carries a single full-width Standard Button.
