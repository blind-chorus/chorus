# Feed

A vertically-stacked content card — the unit of a scrolling feed. Composes a flag, an author row, a body block (title + clamped excerpt + optional thumbnail), optional inline modules (poll, citation, mention), and an engagement footer. Every block beyond the author row is optional.

## Default

The base composition — channel header, title, two-line body, thumbnail, mention, and engagement footer. No `flag` in the default.

```preview
feed/default
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
feed/with-flag
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

A poll module sits between the body block and the mention/engagement footer.

```preview
feed/with-poll
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

### With citation

A citation module naming an external source. Hero image is flush-left at 120px wide; title two-line-clamped.

```preview
feed/with-citation
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

### Full composition

Every optional slot present.

```preview
feed/full
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
- **poll** *(optional)* — inline banner with leading glyph, label, and participant count.
- **citation** *(optional)* — inline link-share card with leading hero and source mark.
- **mention** *(optional)* — tap-anywhere `@Mention` line under the body.
- **engagement** — footer row of `xsmall` [Text Buttons](../button/text.md) — Likes / Comments commit, Views non-interactive.

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
| title        | `heading.md` (20 / Semibold), `onSurface`, single-line truncate |
| body         | 14 / Regular, `onSurfaceVariant`, two-line clamp |
| thumbnail    | 80×80, `radius.sm`, `surfaceContainerHigh` fallback. When `stacked`, overlays `MultipleIcon` at `sys.icon.md`, `ref.palette.white.1000`, 4px top-right inset |
| poll         | `surfaceVariant` fill, `radius.md`, 12×16 padding, 48px min-height, 14px body. Leading glyph (`brand`) + label at 4px gap, 12px to divider, 12px to count. |
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
