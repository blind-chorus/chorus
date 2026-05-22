# Post

Sub-component of the [Feed](./feed.md) family. The authored-content card — the unit of a scrolling feed. Composes a flag, an author row, a body block (title + clamped excerpt + optional thumbnail), optional inline modules (poll, citation, mention), and an engagement footer. Every block beyond the author row is optional. For the sponsored-placement counterpart see [Feed · Ad](./ad.md).

## Default

The base composition — channel header, title, two-line body, thumbnail, mention, and engagement footer. No `flag` in the default.

```preview
feed/post-default
---
import { Feed } from '@blind-dsai/ui';

<Feed
  avatar={{ alt: 'Channel' }}
  channel="Channel"
  timestamp="Now"
  followAction
  meta={['Company', 'Job Function', 'Username']}
  title="Title"
  body="Body textBody textBody textBody textBody textBody textBody…"
  thumbnail={{ alt: 'Cover', stacked: true }}
  mention="@Mention"
  engagement={{ likes: 999, comments: 999, views: 999 }}
/>
```

## Use cases

### With flag

The optional `flag` slot — a single-word editorial label (`HOT`, `NEW`, `PINNED`). Use sparingly.

```preview
feed/post-with-flag
---
import { Feed } from '@blind-dsai/ui';

<Feed
  flag="HOT"
  avatar={{ alt: 'Channel' }}
  channel="Channel"
  timestamp="Now"
  followAction
  meta={['Company', 'Job Function', 'Username']}
  title="Title"
  body="Body textBody textBody textBody textBody textBody textBody…"
  thumbnail={{ alt: 'Cover', stacked: true }}
  mention="@Mention"
  engagement={{ likes: 999, comments: 999, views: 999 }}
/>
```

### With poll

A poll module sits between the body block and the mention/engagement footer. Leading `PollFillIcon` + label paint in `sys.color.brand`; the label is constrained to the literal `Poll`.

```preview
feed/post-with-poll
---
import { Feed } from '@blind-dsai/ui';

<Feed
  flag="HOT"
  channel="Channel"
  timestamp="Now"
  followAction
  meta={['Company', 'Job Function', 'Username']}
  title="Title"
  body="Body textBody textBody textBody textBody textBody textBody…"
  thumbnail={{ alt: 'Cover' }}
  poll={{ label: 'Poll', participants: 'Number' }}
  mention="@Mention"
  engagement={{ likes: 999, comments: 999, views: 999 }}
/>
```

### With offer evaluation

An offer-evaluation module — the author publishes their current salary or a competing offer and asks the community for better-option signals. Identical chrome to `with-poll`, but the leading glyph swaps to `CompensationFillIcon` and both the glyph and the label paint in `sys.color.success` (resolves to `ref.palette.green.500`). The label is constrained to the literal `Offer`.

```preview
feed/post-with-offer
---
import { Feed } from '@blind-dsai/ui';

<Feed
  flag="HOT"
  channel="Channel"
  timestamp="Now"
  followAction
  meta={['Company', 'Job Function', 'Username']}
  title="Title"
  body="Body textBody textBody textBody textBody textBody textBody…"
  thumbnail={{ alt: 'Cover' }}
  offer={{ label: 'Offer', participants: 'Number' }}
  mention="@Mention"
  engagement={{ likes: 999, comments: 999, views: 999 }}
/>
```

### With citation

A citation module naming an external source. Hero image is flush-left at 120px wide; title two-line-clamped.

```preview
feed/post-with-citation
---
import { Feed } from '@blind-dsai/ui';

<Feed
  channel="Channel"
  timestamp="Now"
  meta={['Company', 'Job Function', 'Username']}
  title="Title"
  body="Body textBody textBody textBody textBody textBody textBody…"
  citation={{
    title: 'Keep subject area text on two lines or less.',
    source: 'Source',
  }}
  engagement={{ likes: 999, comments: 999, views: 999 }}
/>
```

### Group

Three Post cards bundled vertically inside a `<FeedGroup>` semantic wrapper — used for thread-grouped or topic-bundled feeds where consecutive posts belong together. The wrapper adds no surface chrome: each inner Post keeps its own padding and hairline bottom divider, so the bundle reads as a continuous slice of the stream while the wrapper carries the intent (`role="region"` + optional `aria-label`). 3 is the canonical demo count; the wrapper accepts any number of Post children.

```preview
feed/post-group
---
import { Feed, FeedGroup } from '@blind-dsai/ui';

<FeedGroup label="Today's top discussions">
  <Feed
    channel="Channel"
    timestamp="2h"
    title="First post in the bundle"
    body="Short excerpt for the first post. Two lines max before the clamp kicks in."
    engagement={{ likes: 240, comments: 12, views: 1840 }}
  />
  <Feed
    channel="Channel"
    timestamp="3h"
    title="Second post — same topic, different angle"
    body="Another excerpt. The wrapper carries the bundle intent so the posts read as one continuous slice."
    engagement={{ likes: 96, comments: 4, views: 720 }}
  />
  <Feed
    channel="Channel"
    timestamp="5h"
    title="Third post wraps the bundle"
    body="Final excerpt. The last post's bottom divider closes the bundle the same way a standalone Post would."
    engagement={{ likes: 58, comments: 2, views: 410 }}
  />
</FeedGroup>
```

### Full composition

Every optional slot present.

```preview
feed/post-full
---
import { Feed } from '@blind-dsai/ui';

<Feed
  flag="HOT"
  channel="Channel"
  timestamp="Now"
  followAction
  meta={['Company', 'Job Function', 'Username']}
  title="Title"
  body="Body textBody textBody textBody textBody textBody textBody…"
  thumbnail={{ alt: 'Cover', stacked: true }}
  poll={{ label: 'Poll', participants: 'Number' }}
  citation={{
    title: 'Keep subject area text on two lines or less.',
    source: 'Source',
  }}
  mention="@Mention"
  engagement={{ likes: 999, comments: 999, views: 999 }}
/>
```

## Slots

- **flag** *(optional)* — single-word editorial label (`HOT`, `NEW`, `PINNED`).
- **avatar** — channel thumbnail at the 32 rung.
- **channel** + **timestamp** + **followAction** *(optional)* — header row: channel link, relative time, inline Follow/Following affordance.
- **meta** — middot-separated author metadata links; single line, truncates.
- **title** + **body** — post title (single line, truncates) over a two-line clamped excerpt.
- **thumbnail** *(optional)* — 80×80 trailing image; overlays `MultipleIcon` when `stacked`.
- **poll** *(optional)* — inline banner with leading `PollFillIcon` (brand tone), label `Poll`, divider, and participant count.
- **offer** *(optional)* — inline banner with leading `CompensationFillIcon` (success / green-500 tone), label `Offer`, divider, and participant count. Same chrome as `poll`; carries an offer-evaluation post (current salary or competing offer surfaced for community input). Label is constrained to `Poll` or `Offer` across both modules combined — no other string is valid.
- **citation** *(optional)* — inline link-share card with leading hero and source mark.
- **mention** *(optional)* — tap-anywhere `@Mention` line under the body.
- **engagement** — footer row of `xsmall` [Text Buttons](../button/text.md) — Likes / Comments commit, Views non-interactive.
- **bottom divider** *(intrinsic)* — hairline `outlineVariant` seam at the card's bottom edge so consecutive Posts in a stream share a deliberate divider rhythm. Painted via `border-bottom`; layout-safe under `box-sizing: border-box`.

## Anatomy

| Slot         | Token bindings |
|--------------|----------------|
| container    | `surface` fill, `sys.layout.container.lg` (24px mobile / 32px web) block × `sys.layout.container.md` (16px) inline padding, `sys.layout.stack.md` between blocks |
| flag         | `label.sm` / Semibold, `brand` foreground. Optional; omitted by default. |
| avatar       | [Thumbnail](../thumbnail/thumbnail.md) `size={32}` — delegated verbatim |
| header layout| Avatar + text column as a row, vertically centred |
| channel      | 12 / Semibold, `onSurface`. `<a>`; hover underline on link; focus = hairline `sys.color.focus` at `sys.radius.xs`. |
| timestamp    | 12 / Regular, `outline` |
| followAction | 12 / Semibold, `primary` (inactive) → `onSurfaceVariant` (active) |
| channel-row  | Single row, siblings at 8px (`sys.layout.inline.md`) gap |
| meta         | 12 / Regular, `onSurfaceVariant`. Each item `<a>`; middot at `sys.layout.inline.sm` (4px), decorative. |
| title → body | 8px vertical gap |
| title        | `heading.sm` (16 / Semibold), `onSurface`, single-line truncate |
| bottom divider | `sys.borderWidth.hairline` × `sys.color.outlineVariant` — `border-bottom` on the card so consecutive posts in a stream share a deliberate seam. |
| body         | 14 / Regular, `onSurfaceVariant`, two-line clamp |
| thumbnail    | 80×80, `radius.sm`, `surfaceContainerHigh` fallback. When `stacked`, overlays `MultipleIcon` at `sys.icon.md`, `ref.palette.white.1000`, 4px top-right inset |
| poll         | `surfaceVariant` fill, `radius.md`, 12×16 padding, 48px min-height, 14px body. Leading `PollFillIcon` + label (`Poll`) painted in `sys.color.brand` at 4px gap, 12px to divider, 12px to count. |
| offer        | Identical chrome to `poll` — `surfaceVariant` fill, `radius.md`, 12×16 padding, 48px min-height, 14px body. Leading `CompensationFillIcon` + label (`Offer`) painted in `sys.color.success` (`ref.palette.green.500`) at 4px gap, 12px to divider, 12px to count. |
| citation     | Text-column `surfaceVariant`, `radius.md`, 120px-wide hero. 12px padding, 8px gap between title and source. All text at 12px. Source mark 16×16 at 4px radius, 4px to source name. |
| mention      | `body.sm`, `primary`, italic |
| engagement   | `xsmall` [Text Buttons](../button/text.md) (Likes / Comments) + static `<span>` (Views). 16px glyph + 12 / Regular label, 4×8 padding, 4px glyph↔count gap. Row gap 12px. Rest `onSurfaceVariant`; active Like retones label to `sys.color.brand` with `HeartFillIcon`. Optical alignment by default. |

## Sizes

A single rung. The card stretches to its column (`width: 100%`); on web a feed column typically caps at `comp-content-max`.

## States

Feed is not itself interactive — interaction lives in the controls it carries. The card surface has no hover/pressed/focused treatment.

## Focus indicator

Feed itself is not a focus target; each focusable control paints its own ring per its spec (Text Button / link rings are Outward by default). Composition for any future card-level focus target: Inward — Feed cards tile with a hairline divider between them. Trigger: `:focus-visible`.

## Behavior

- **Slot omission collapses without leaving a gap.** Optional blocks drop out entirely. `flag` is opt-in — most posts render without one.
- **Truncation, not wrap.** `meta` and `title` truncate; `body` clamps to two lines.
- **Thumbnail rides the title + body block.** A flex sibling, so the body's two-line clamp computes against reduced inline width.
- **Engagement counters do not reflow.** Footer stays single-line; tiny screens scroll the row.
- **Like is a toggle.** Tapping increments the count and swaps `HeartIcon` for `HeartFillIcon` filled in `sys.color.brand` via a `--button-text-label` override. Tap again to revert. Controlled (`liked` + `onLikeChange`) or uncontrolled.
- **Like aligns to the content rail by default** via Text Button's [optical alignment](../button/text.md#optical-alignment).
- **Comments commits; Views does not.** Views renders as a non-interactive `<span>` — no hover, no focus ring, no `cursor: pointer`.
- **Channel and meta are independent links.** Middot separators are decorative (`aria-hidden`) and outside the link hit area.
- **`<FeedGroup>` bundles consecutive Posts.** Three (or more) Post cards stacked inside one semantic wrapper for thread-grouped or topic-bundled feeds. The group adds no surface chrome — each inner Post keeps its own padding and hairline bottom divider, so the bundle reads as a continuous slice of the stream. The wrapper carries intent via `role="region"` + optional `aria-label`.
