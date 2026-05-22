import { cloneElement, isValidElement } from 'react';
import { joinClasses } from './spec-utils.js';

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
}) {
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
