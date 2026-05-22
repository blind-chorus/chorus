// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
import { cloneElement, isValidElement } from 'react';
import { joinClasses } from './spec-utils';

/** Props for Tooltip. Generated from schema/components/tooltip/tooltip.spec.json — edit there, then re-run `npm run build:lovable`. */
export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Body text — a short hint or label. Wraps within the max-width cap. Tooltip copy may run longer than a button label, but should stay intuitive at a glance. */
  children: React.ReactNode;
  /** `default` paints the bubble in `primary` with an `onPrimary` foreground — the brand-blue tooltip. `inverse` paints in the inverse cluster (`inverseSurface` / `inverseOnSurface`) for use on screens already saturated with primary tone, where the brand-blue bubble would compete with the surrounding chrome. */
  appearance?: "default" | "inverse";
  /** Where the bubble sits relative to its trigger. The `<edge>` axis (top / bottom) chooses whether the bubble floats above or below the trigger and which edge the caret renders on. The `<align>` axis (start / center / end) shifts the caret along the parallel axis so it lines up with an off-centre trigger — pick `-start` when the trigger sits near the leading edge of the viewport, `-end` when it sits near the trailing edge, and the bare edge name when the trigger is comfortably centred. Left/right placements are intentionally not in the enum — Tooltip is a top/bottom affordance; for side-anchored disclosure surfaces reach for a popover-style host instead. */
  placement?: "top-start" | "top" | "top-end" | "bottom-start" | "bottom" | "bottom-end";
  /** Optional Button node rendered after the body. Canonical bindings: `<Button variant="text" size="small" appearance="onPrimary">` for the `default` (primary) tooltip, or `<Button variant="text" size="small" appearance="inverse">` for the `inverse` tooltip — so the label paints in the correct on-host token in either theme. Layout: inline-trailing when the body fits on one line; stacks below the body once the body wraps. */
  action?: React.ReactNode;
}

/* Tooltip — trigger-anchored explanation bubble. Two appearances:
   `default` paints the brand-blue bubble (`primary` / `onPrimary`, both
   theme-stable) and is the canonical reach; `inverse` swaps to the
   inverse cluster (`inverseSurface` / `inverseOnSurface`) for screens
   already saturated with primary tone, where the brand-blue bubble
   would compete with the surrounding chrome.

   Presentational only: the owner positions the bubble relative to its
   trigger (honouring the 16-token viewport safe area and the 4-token
   trigger offset spelled out in the spec) and mounts/unmounts on
   hover/focus.

   The `action` slot accepts a Button node directly — bind its
   `appearance` to match the tooltip: `onPrimary` for the default
   (brand-blue) tooltip so the label stays white in both themes, or
   `inverse` for the inverse tooltip so the label flips with the host
   fill. */
export function Tooltip({
  children,
  appearance = 'default',
  placement = 'top',
  action,
  className,
  ...rest
}: TooltipProps) {
  const actionEl = isValidElement(action)
    ? cloneElement(action, {
        className: joinClasses('chorus-tooltip__action', action.props.className),
      })
    : action;
  return (
    <div
      className={joinClasses(
        'chorus-tooltip',
        `chorus-tooltip--appearance-${appearance}`,
        className,
      )}
      data-placement={placement}
      role="tooltip"
      {...rest}
    >
      <span className="chorus-tooltip__body">{children}</span>
      {actionEl}
      <span className="chorus-tooltip__caret" aria-hidden="true" />
    </div>
  );
}
