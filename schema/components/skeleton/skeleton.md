# Skeleton

A tonal placeholder block that previews where real content will render. Paints in `surfaceContainerHighest` with a slow opacity pulse. Three shapes — `text` (default 16-line block), `block` (image / card body), `circle` (avatar). Compose multiple Skeletons inside `SkeletonGroup` to mirror the loading content's rhythm.

**Reach for this when** a list row, feed post, card cover, or avatar is being fetched and the host would otherwise paint empty. **Skip when** the wait is sub-300ms, the data is unavailable rather than loading (use an empty-state illustration), or the loading scope is the whole screen (use a centered progress indicator at page level).

**Layout inset.** `inline` — Skeleton ships no padding or container chrome of its own. Sits as a leaf inside whichever surface it stands in for. Width and height are consumer-supplied. `SkeletonGroup` adds an 8px gap between stacked siblings.

## Default

A single text-line placeholder. 16px high, full-width by default.

```preview
skeleton/default
---
import { Skeleton } from '@blind-dsai/ui';

<Skeleton />
```

## Use cases

### Block

A rectangular tonal block. 80px high by default — reads as a card cover, image area, or card body placeholder. Pass `height` to match the real content's footprint.

```preview
skeleton/block
---
import { Skeleton } from '@blind-dsai/ui';

<Skeleton shape="block" height={120} />
```

### Circle

An avatar placeholder. 40 × 40 by default — matches a 40-rung [Thumbnail](../thumbnail/thumbnail.md). Override `width` / `height` for a different rung.

```preview
skeleton/circle
---
import { Skeleton } from '@blind-dsai/ui';

<Skeleton shape="circle" />
```

### List row

A list-row loading state — leading 40-circle next to two stacked text lines. Use the same widths as the real row so the swap to live data doesn't reflow.

```preview
skeleton/list-row
---
import { Skeleton, SkeletonGroup } from '@blind-dsai/ui';

<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-md)', padding: 'var(--sys-layout-container-xs) var(--sys-layout-container-md)' }}>
  <Skeleton shape="circle" />
  <SkeletonGroup aria-label="Loading row" style={{ flex: 1 }}>
    <Skeleton width="60%" />
    <Skeleton width="40%" />
  </SkeletonGroup>
</div>
```

### Feed post

A feed-post loading state — author row (avatar + name + meta), title, two body lines, and a 16:9 cover block. Mirrors the rhythm of a real feed/post.

```preview
skeleton/feed-post
---
import { Skeleton, SkeletonGroup } from '@blind-dsai/ui';

<SkeletonGroup aria-label="Loading post" style={{ padding: 'var(--sys-layout-container-md)' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-layout-inline-md)' }}>
    <Skeleton shape="circle" width={32} height={32} />
    <SkeletonGroup style={{ flex: 1 }}>
      <Skeleton width="40%" />
      <Skeleton width="25%" />
    </SkeletonGroup>
  </div>
  <Skeleton width="85%" height={20} />
  <Skeleton />
  <Skeleton width="70%" />
  <Skeleton shape="block" height={180} />
</SkeletonGroup>
```

## Slots

- **container** — the tonal block. `surfaceContainerHighest` fill, shape-dependent radius. Carries the pulse animation. `role='status'` + `aria-live='polite'` so screen readers announce the loading state without yanking focus.

## Anatomy

| Slot       | Token bindings |
|------------|----------------|
| container  | `sys.color.surfaceContainerHighest` fill, `sys.radius.xs` corners (`text` / `block`) or full round (`circle`), no stroke |
| text       | Default 16px height × 100% width |
| block      | Default 80px height × 100% width |
| circle     | Default 40 × 40 round |
| group gap  | `SkeletonGroup` flex column, `sys.layout.stack.xs` (8px) between stacked Skeletons |

## Shapes

| Shape    | Default footprint | Corners            | When to reach                                                            |
|----------|-------------------|--------------------|-------------------------------------------------------------------------|
| `text`   | 16 × 100%         | `sys.radius.xs`    | Single line of body copy — the canonical default.                       |
| `block`  | 80 × 100%         | `sys.radius.xs`    | Image area, card cover, multi-line body block. Override `height` to fit. |
| `circle` | 40 × 40           | fully round        | Avatar placeholder — matches a 40-rung [Thumbnail](../thumbnail/thumbnail.md). |

## States

| State     | Animation                            | Notes |
|-----------|--------------------------------------|-------|
| `default` | `pulse 1.6s ease-in-out infinite`     | Opacity oscillates between `0.5` and `1`. No hue shift. |
| reduced-motion | suppressed                       | Under `prefers-reduced-motion: reduce` the pulse halts and the block stays at full opacity. |

## Behavior

- **Footprint matches content.** Pass `width` / `height` so the placeholder matches the data it replaces — swap should not reflow.
- **Group for multi-line.** Stack Skeletons inside a `SkeletonGroup` to keep the 8px sibling gap consistent.
- **Single screen role.** `role='status'` + `aria-live='polite'` announces loading without interrupting focus. Announcement carries the `aria-label` (defaults to `'Loading'`).
- **Atomic swap.** Replace the Skeleton with real content in one render — no cross-fade.
