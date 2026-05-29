'use client';

import { joinClasses } from './spec-utils.js';

/* Divider — heavy section-break band that splits adjacent regions
   whose vertical rhythm alone doesn't read as a boundary. Single
   full-bleed block painted with `sys.color.scrimSubtle` at a fixed
   `sys.layout.stack.xs` (8) block thickness — the same scrim tier
   used by Banner default, Chip / Tag default, Progress track,
   StatusTag neutral, and Skeleton. No appearance / thickness /
   orientation axis: Divider ships one canonical band. Defaults to
   `aria-hidden="true"` because the band is decorative chrome — screen-
   reader users navigate by headings, not visual breaks. See schema/
   components/divider/divider.md. */

export function Divider({
  className,
  'aria-hidden': ariaHidden = true,
  ...rest
}) {
  return (
    <hr
      aria-hidden={ariaHidden}
      className={joinClasses('chorus-divider', className)}
      {...rest}
    />
  );
}
