# Progress

A single visual rung — 8px tall, fully rounded — that previews how far a long-running task has advanced. Two modes share one anatomy: **determinate** (filled indicator at the value's ratio) and **indeterminate** (40%-wide indicator animates left-to-right). No emphasis axis: track paints with a Banner-style scrim (`black.200` in light, `white.200` in dark); indicator paints in `inverseSurface` so the filled segment contrasts against the track regardless of theme.

**Reach for this when** a screen holds a task long enough that the user would otherwise wonder if anything is happening — file uploads, onboarding step counters, background syncs, account migrations. **Skip when** the task resolves under 300ms, the wait is purely opaque (use [Skeleton](../skeleton/skeleton.md) for content placeholders, busy spinners for short opaque waits), or the metric is primary content rather than chrome (use a chart).

**Layout inset.** `inline` — Progress ships no padding of its own. Stretches to fill whichever host column it sits in. Pair with a label / supporting line via the host surface, not Progress itself.

## Default

A determinate progress bar at 40%. 8px tall, `radius.full` corners, `inverseSurface` indicator on a Banner-style scrim track. Transitions over 200ms when `value` changes.

```preview
progress/default
---
import { Progress } from '@blind-dsai/ui';

<Progress value={0.4} aria-label="Uploading file" />
```

## Use cases

### Indeterminate

Omit `value` (or pass `indeterminate`) for the sliding-segment animation. Reach for it when duration is unknown — initial fetches, background sync, queued operations. A 40%-wide segment slides through the track on a 1.6s loop.

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

- **Determinate transition.** `value` jumps animate over 200ms `ease-out` — a 30% → 60% step reads as movement, not a pop.
- **Indeterminate animation.** 40%-wide segment slides `translateX(-100%)` → `translateX(100%)` on a 1.6s loop. Under `prefers-reduced-motion: reduce`, animation suppressed and indicator settles at a steady offset.
- **ARIA.** `role="progressbar"`; `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=<rounded percent>` in determinate mode. Indeterminate omits `aria-valuenow`.
- **No label, size, or emphasis slot.** The label (step counter, percent, task name) lives on the host surface. The family carries a single visual rung (8px) and a single appearance (inverseSurface on a scrim track).
