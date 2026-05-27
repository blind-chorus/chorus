'use client';

import { joinClasses } from './spec-utils.js';

/* Progress — linear progress bar. Two modes:
   - determinate (default): pass `value` 0..1 (or `max` with `value` raw).
     A filled segment shows the completion ratio.
   - indeterminate: omit `value` and pass `indeterminate`. A sliding
     segment animates left-to-right; reduced-motion suppresses the
     animation and shows a steady half-filled track instead.
   Single visual rung — 8px tall, radius.full, `inverseSurface`
   indicator on a Banner-style track scrim (black.200 light /
   white.200 dark) so the bar reads on any host surface.
   See schema/components/progress/progress.md. */

export function Progress({
  value,
  max = 1,
  indeterminate = false,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const isIndeterminate = indeterminate || value == null;
  const ratio = isIndeterminate ? null : Math.max(0, Math.min(1, value / max));
  const percent = ratio == null ? null : Math.round(ratio * 100);

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={isIndeterminate ? undefined : 100}
      aria-valuenow={isIndeterminate ? undefined : percent}
      data-indeterminate={isIndeterminate ? 'true' : undefined}
      className={joinClasses('chorus-progress', className)}
      {...rest}
    >
      <span
        className="chorus-progress__indicator"
        style={isIndeterminate ? undefined : { transform: `translateX(${-100 + percent}%)` }}
        aria-hidden="true"
      />
    </div>
  );
}
