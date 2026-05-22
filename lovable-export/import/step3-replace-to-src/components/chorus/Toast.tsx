// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
import { cloneElement, isValidElement } from 'react';
import { joinClasses } from './spec-utils';

/* Toast — transient confirmation strip. Inverse-toned by default so the
   message reads against any underlying page tier without per-surface
   tuning. Presentational only: the owner mounts and unmounts the toast
   on its own timer.

   The `trailing` slot accepts a Button node directly — typically a
   `<Button variant="text" size="small" appearance="inverse">` for an
   action affordance (Undo, View) or a `<Button variant="icon"
   size="medium" appearance="inverse">` for explicit dismissal. Passing
   the Button as a node (rather than a shorthand object) keeps the
   composition explicit at the call site: a reader sees the exact
   sub-component the Toast delegates to, including its `appearance`
   binding. */
export function Toast({
  children,
  trailing,
  className,
  ...rest
}) {
  const trailingEl = isValidElement(trailing)
    ? cloneElement(trailing, {
        className: joinClasses('chorus-toast__trailing', trailing.props.className),
      })
    : trailing;
  return (
    <div
      className={joinClasses('chorus-toast', className)}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className="chorus-toast__body">{children}</span>
      {trailingEl}
    </div>
  );
}
