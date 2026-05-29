'use client';

import { joinClasses } from './spec-utils.js';

/* Bubble — always-on annotation bubble. A small pill-shaped label with
   a caret/tail pointing at an anchor UI element. Distinct from Tooltip
   on three axes: persistent (Tooltip is transient), lower visual
   priority (no elevation, smaller padding, single line), and never
   occludes neighbours (host positions it inline). Ships with a default
   `sys.color.primary` / `sys.color.onPrimary` fill — both theme-stable
   so the bubble reads identically in light and dark mode. Operations
   re-tint per campaign by setting `--bubble-fill` and `--bubble-ink`
   on the bubble's inline style; the tail inherits the fill via
   `background: inherit`, so one declaration covers both surfaces.
   See schema/components/bubble/bubble.md. */

export function Bubble({
  children,
  tailSide = 'top',
  tailAlign = 'center',
  className,
  ...rest
}) {
  return (
    <div
      className={joinClasses('chorus-bubble', className)}
      data-tail-side={tailSide}
      data-tail-align={tailAlign}
      role="note"
      {...rest}
    >
      <span className="chorus-bubble__body">{children}</span>
      <span className="chorus-bubble__tail" aria-hidden="true" />
    </div>
  );
}
