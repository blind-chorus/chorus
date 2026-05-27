# Progress

A single visual rung — 8px tall, fully rounded — that previews how far a long-running task has advanced. Two modes share one anatomy: **determinate** (a filled indicator sits at the value's ratio) and **indeterminate** (a 40%-wide indicator animates left-to-right through the track). No emphasis axis: the track paints with the same Banner-style scrim recipe (`black.200` in light, `white.200` in dark) so it reads on any host surface tier, and the indicator paints in `inverseSurface` so the filled segment always contrasts against the track regardless of theme.

**Reach for this when** a screen holds a task whose duration is long enough that the user would otherwise wonder if anything is happening — file uploads, onboarding step counters, background syncs, account migrations. **Skip when** the task resolves in under 300ms (no progress needed — show the result), the wait is purely opaque ([Skeleton](../skeleton/skeleton.md) for content placeholders, busy spinners for short opaque waits), or the metric is the screen's primary content rather than chrome (use a chart, not a progress bar).

**Layout inset.** `inline` — Progress ships no padding of its own. It stretches to fill whichever host column it sits in, so the consumer controls footprint by the wrapping element. Pair with a label / supporting line above it via the host surface, not via Progress itself.

## Default

A determinate progress bar at 40%. 8px tall, `radius.full` corners, the `inverseSurface` indicator filling a Banner-style scrim track. Transitions smoothly over 200ms when `value` changes.

```preview
progress/default
---
import { Progress } from '@blind-dsai/ui';

<Progress value={0.4} aria-label="Uploading file" />
```

## Use cases

### Indeterminate

Omit `value` (or pass `indeterminate`) for the sliding-segment animation. Reach for it when the task is busy but its duration is unknown — initial fetches, background sync, queued operations. A 40%-wide segment slides through the track on a 1.6s loop.

```preview
progress/indeterminate
---
import { Progress } from '@blind-dsai/ui';

<Progress indeterminate aria-label="Syncing in the background" />
```

## Slots

- **track** — fully-rounded background block. 8px tall, mode-aware scrim fill (`ref.palette.black.200` in light, `ref.palette.white.200` in dark), no stroke. Carries `role="progressbar"` and the aria-value attributes.
- **indicator** *(decorative)* — inner filled segment painted in `sys.color.inverseSurface`. In determinate mode it's `translateX`'d so the trailing edge lands at the value's ratio; in indeterminate mode a 40%-wide segment animates left-to-right on a 1.6s loop.

## Anatomy

| Slot         | Token bindings |
|--------------|----------------|
| track (light) | `ref.palette.black.200` fill, `sys.radius.full`, 8px (`sys.layout.container.xs`) tall |
| track (dark)  | `ref.palette.white.200` fill, otherwise identical |
| indicator    | `sys.color.inverseSurface` fill, fully rounded, `transform: translateX(…)` driven |
| transition   | 200ms `ease-out` on indicator transform as `value` changes |
| indeterminate | 40% width segment, 1.6s `cubic-bezier(0.65, 0, 0.35, 1)` loop on `translateX(-100% → 100%)` |

## Behavior

- **Determinate transition.** `value` jumps animate over 200ms `ease-out` rather than snapping — so a 30% → 60% step reads as movement, not a pop.
- **Indeterminate animation.** A 40%-wide segment slides from `translateX(-100%)` to `translateX(100%)` on a 1.6s loop. Under `prefers-reduced-motion: reduce` the animation is suppressed and the indicator settles at a steady offset segment so the busy state stays visible.
- **ARIA.** `role="progressbar"`; `aria-valuemin=0`, `aria-valuemax=100` and `aria-valuenow=<rounded percent>` in determinate mode. Indeterminate omits `aria-valuenow` so screen readers announce 'busy'.
- **No label, size, or emphasis slot.** The label (step counter, percent text, task name) lives on the host surface, not inside Progress. The family carries a single visual rung (8px) and a single appearance (inverseSurface on a scrim track) — emphasis belongs in the surrounding copy.
