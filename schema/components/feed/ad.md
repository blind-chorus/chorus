# Ad

Sub-component of the [Feed](./feed.md) family. A sponsored placement riding the same scrolling column as [Feed · Post](./post.md). The header trades a channel/author row for a brand row (32-rung [Thumbnail](../thumbnail/thumbnail.md) + brand name + `Sponsored` subtitle + trailing close affordance); the body stays the same shape as Feed's title + excerpt; hero media and CTA bond into a single rounded slab at the foot. No engagement row — ads are not authored content.

**Required slots.** Every FeedAd carries an explicit `brand.name` (the ad's legal attribution surface) and a hero `media` block with a non-empty `src`. When scaffolding, fill `media.src` with `/placeholder.png` rather than omitting `media` — the runtime `surfaceContainerHigh` fallback is a load-failure safety net, not a design-time opt-out.

**Layout inset.** `full-bleed` — sits as a direct child of the page shell. Pays its own `16px inline / 12px block` padding via `layout.container.*`; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Brand row (no dismiss), headline, body excerpt, and hero + CTA slab. Dismiss is opt-in; the CTA fill plumbs through the advertiser's brand Hex via `cta.color`.

```preview
feed/ad-default
---
import { FeedAd } from '@blind-dsai/ui';

<FeedAd
  brand={{
    name: 'Acme Coffee',
    avatar: { src: '/placeholder.png', alt: 'Acme Coffee logo' },
  }}
  title="Your morning brew, on us."
  body="Sign up this week and your first bag of single-origin beans ships free — no subscription required."
  media={{
    src: '/placeholder.png',
    alt: 'A flat-lay of freshly roasted coffee beans',
  }}
  cta={{ label: 'Claim your free bag', color: '#3DB1A3' }}
/>
```

## Use cases

### With dismiss

Wire `onDismiss` to render the trailing close icon for placements that give the reader a dismiss path.

```preview
feed/ad-with-dismiss
---
import { FeedAd } from '@blind-dsai/ui';

<FeedAd
  brand={{
    name: 'Lumen Fitness',
    avatar: { src: '/placeholder.png', alt: 'Lumen Fitness logo' },
  }}
  onDismiss={() => {}}
  title="Train smarter, not longer."
  body="Personalized 20-minute workouts that adapt to your recovery — free for the first 30 days, no card required."
  media={{ src: '/placeholder.png', alt: 'An athlete mid-workout in a sunlit studio' }}
  cta={{ label: 'Start your free trial', color: '#5E4BDB' }}
/>
```

## Slots

- **brand** *(required)* — leading row: 32-rung [Thumbnail](../thumbnail/thumbnail.md) + brand name (`label.md` / `onSurface`) + `Sponsored` subtitle (`caption.md` / `onSurfaceVariant`) stacked. `brand.name` MUST be non-empty. Subtitle defaults to `Sponsored`; consumers may override but cannot drop it.
- **dismiss** *(optional)* — trailing 16px close icon, only rendered when `onDismiss` is wired.
- **title** *(optional)* — single-line headline (`heading.sm` / `onSurface`).
- **body** *(optional)* — two-line clamped excerpt (`body.sm` / `onSurfaceVariant`).
- **cta-group** *(required)* — foot slab. Hero **media** required; CTA optional but typical. Media (16:10) and the full-width [Standard Button](../button/standard.md) sit flush inside a single `radius.md` clip with no internal gap. `cta.color` accepts an advertiser-supplied Hex swapping the button fill and border; other token bindings stay intact.
- **media** *(required)* — hero creative inside cta-group. Image asset (PNG / JPG / WebP / SVG); fill `src` with `/placeholder.png` when scaffolding.

## Anatomy

| Slot             | Token bindings |
|------------------|----------------|
| container        | `surface` fill, `radius.md`, `sys.layout.container.lg` (24px mobile / 32px web) block × `sys.layout.container.md` (16px) inline padding, `sys.layout.stack.md` between blocks |
| brand row        | [Thumbnail](../thumbnail/thumbnail.md) + text column as a row, `sys.layout.inline.md` (8px) gap, `align-items: center` |
| brand avatar     | [Thumbnail](../thumbnail/thumbnail.md) `size={32}` — delegated verbatim |
| brand name       | `sys.typo.label.md` (14 / Semibold), `onSurface` |
| brand subtitle   | `sys.typo.caption.md` (12 / Regular), `onSurfaceVariant`. Defaults to `Sponsored`. |
| dismiss          | 16px `XIcon` inside a 24-rung hit area, `onSurfaceVariant` glyph, no chrome at rest |
| title → body     | 8px vertical gap (`sys.layout.stack.xs`) |
| title            | `heading.sm` (16 / Semibold), `onSurface`, single-line truncate |
| body             | 14 / Regular, `onSurfaceVariant`, two-line clamp |
| bottom divider   | `sys.borderWidth.hairline` × `sys.color.outlineVariant` — `border-bottom` on the card so a sponsored placement drops into a Post stream without breaking the inter-card seam rhythm. |
| cta-group        | `radius.md` (8px) clip wrapping media + CTA, `overflow: hidden`, no internal gap |
| media            | Full inline width, 16:10 aspect ratio, no own radius (the group clips). Runtime fallback when `src` is missing or fails to load: `background-image: url('/placeholder.png')` over a `surfaceContainerHigh` base. |
| cta              | [Standard Button](../button/standard.md) — `fullWidth`, `medium`, `primary` by default, **`border-radius: 0`** so the squared bottom edge meets the group's clip. `cta.color` overrides the surface fill with a free-form Hex. |

## Sizes

A single rung. The card stretches to its column (`width: 100%`); on web an ad column inherits the same `comp-content-max` cap as Feed.

## States

FeedAd is not itself interactive — commit lives in the dismiss and CTA. The card surface has no hover/pressed/focused treatment.

## Focus indicator

FeedAd is not a focus target; each focusable child (dismiss button, CTA) paints its own ring per its spec.

## Behavior

- **Brand name is required.** Every FeedAd carries an explicit `brand.name` — the row is the ad's legal attribution surface. Generators must never drop it.
- **Hero media is required.** Every FeedAd carries a `media` block with a non-empty `src`. The `surfaceContainerHigh` fallback is a runtime safety net; use `/placeholder.png` when scaffolding.
- **Brand subtitle is always present.** Defaults to `Sponsored`. Consumers may override copy but cannot omit the row.
- **Hero media and CTA are one slab.** Share a `radius.md` clip with no internal gap; the CTA's own corner radius is zeroed so its squared bottom edge meets the group's outer round.
- **Free-form CTA color.** `cta.color` accepts any Hex from the ad client. Only button fill and border swap — typography, size, and full-width geometry stay on Standard Button tokens.
- **Slot omission collapses without a gap.** `title`, `body`, and `dismiss` are opt-in; `brand.name` and `media` are required.
- **Truncation, not wrap.** `title` truncates; `body` clamps to two lines.
- **Dismiss is opt-in.** Default placements omit it; the trailing X only renders when `onDismiss` is wired.
- **At most one CTA.** No engagement row — the cta-group, when present, carries a single full-width Standard Button.
