# Post

Sub-component of the [Feed](./feed.md) family. The authored-content card — the unit of a scrolling feed. Composes a flag, author row, body block (title + clamped excerpt + optional thumbnail), optional inline modules (poll, offer, citation, mention), and an engagement footer.

**Reach for this when** rendering a single user-authored entry — text post, poll, offer evaluation, link share. **Skip when** the placement is sponsored ([Feed · Ad](./ad.md)) or the row is a metric summary rather than authored content.

**Layout inset.** full-bleed — Post contributes its own surface padding (`container.lg` block × `container.md` inline) and a hairline bottom divider, so a stream of Posts tiles edge-to-edge inside the feed column.

## Default

Channel header, title, two-line body, thumbnail, mention, engagement footer. No `flag`.

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

Optional single-word editorial label (`HOT`, `NEW`, `PINNED`). Use sparingly.

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

Inline poll module between body and mention/footer. Leading `PollFillIcon` + label paint in `sys.color.brand`; label is constrained to the literal `Poll`.

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

Same chrome as `poll`; leading glyph swaps to `CompensationFillIcon` and both glyph and label paint in `sys.color.success`. Label constrained to the literal `Offer`.

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

Citation module naming an external source. Hero image flush-left at 120px wide; title two-line-clamped.

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

Three (or more) Post cards bundled inside `<FeedGroup>` for thread-grouped or topic-bundled feeds. The wrapper adds no chrome — inner Posts keep padding and divider; the wrapper carries intent (`role="region"` + optional `aria-label`).

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

- **flag** *(optional)* — single-word editorial label.
- **avatar** — channel thumbnail at the 32 rung.
- **channel** + **timestamp** + **followAction** *(optional)* — header row.
- **meta** — middot-separated author metadata links; single line, truncates.
- **title** + **body** — title (single line, truncates) over a two-line clamped excerpt.
- **thumbnail** *(optional at runtime, agent-required at scaffold time)* — 80×80 trailing image; overlays `SquareStackIcon` when `stacked`. Agents MUST always pass this slot — fill `src` with a real subject photo when implied, `/placeholder.png` otherwise. The runtime omission-collapse is a safety net for downstream consumers, not a license to skip the slot at generation time.
- **poll** / **offer** *(optional)* — inline banners sharing chrome. Label constrained to `Poll` or `Offer`.
- **citation** *(optional)* — inline link-share card with leading hero and source mark.
- **mention** *(optional)* — tap-anywhere `@Mention` line under the body.
- **engagement** — footer row of `xsmall` [Text Buttons](../button/text.md) — Likes / Comments commit, Views non-interactive.
- **bottom divider** *(intrinsic)* — hairline `outlineVariant` seam at the card's bottom edge.

## Anatomy

| Slot         | Token bindings |
|--------------|----------------|
| container    | `surface` fill, `sys.layout.container.lg` (24/32) block × `sys.layout.container.md` (16) inline padding, `sys.layout.stack.md` between blocks |
| flag         | `label.sm` / Semibold, `brand` foreground |
| avatar       | [Thumbnail](../thumbnail/thumbnail.md) `size={32}` — delegated verbatim |
| channel      | 12 / Semibold, `onSurface`. `<a>`; hover underline; focus = hairline `sys.color.focus` at `sys.radius.xs` |
| timestamp    | 12 / Regular, `outline` |
| followAction | 12 / Semibold, `primary` (inactive) → `onSurfaceVariant` (active) |
| meta         | 12 / Regular, `onSurfaceVariant`. Each `<a>`; middot at `sys.layout.inline.sm` (4px), decorative |
| title        | `heading.sm` (16 / Semibold), `onSurface`, single-line truncate. 8px to body |
| body         | 14 / Regular, `onSurfaceVariant`, two-line clamp |
| thumbnail    | 80×80, `radius.sm`, `surfaceContainerHigh` fallback. `stacked` overlays `SquareStackIcon` at `sys.icon.md`, `ref.palette.white.1000`, 4px top-right inset |
| poll / offer | `surfaceVariant` fill, `radius.md`, 12×16 padding, 48px min-height, 14px body. Leading icon + label at 4px gap, 12px to divider, 12px to count. `poll` paints `brand`; `offer` paints `success` (`ref.palette.green.500`) |
| citation     | Text-column `surfaceVariant`, `radius.md`, 120px-wide hero. 12px padding, 8px gap title↔source. All text 12px. Source mark 16×16 at 4px radius, 4px to source name |
| mention      | `body.sm`, `primary`, italic |
| engagement   | `xsmall` [Text Buttons](../button/text.md) + static `<span>` (Views). 16px glyph + 12 / Regular label, 4×8 padding, 4px gap. Row gap 12px. Active Like retones label to `sys.color.brand` with `HeartFillIcon` |
| bottom divider | `sys.borderWidth.hairline` × `sys.color.outlineVariant` — `border-bottom` on the card |

## States

Feed is not itself interactive — interaction lives in the controls it carries. The card surface has no hover/pressed/focused treatment.

## Focus indicator

Feed itself is not a focus target; each focusable control paints its own ring per its spec. Card-level focus targets compose inward. Trigger: `:focus-visible`.

## Behavior

- **Slot omission collapses without a gap.** Optional blocks drop out entirely.
- **Truncation, not wrap.** `meta`/`title` truncate; `body` clamps to two lines; thumbnail is a flex sibling so the clamp computes against reduced inline width.
- **Like is a toggle.** Tapping swaps `HeartIcon` → `HeartFillIcon` filled in `sys.color.brand` via a `--button-text-label` override and increments the count. Controlled (`liked` + `onLikeChange`) or uncontrolled. Aligns to the content rail via Text Button's [optical alignment](../button/text.md#optical-alignment).
- **Comments commits; Views does not.** Views is a non-interactive `<span>` — no hover, focus ring, or `cursor: pointer`.
- **Channel and meta are independent links.** Middot separators are decorative (`aria-hidden`) and outside link hit areas.
- **`<FeedGroup>` bundles consecutive Posts.** Semantic wrapper only — inner Posts keep their own padding and bottom divider.
