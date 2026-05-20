import { forwardRef } from 'react';
import { joinClasses } from '../spec-utils.js';
import { CheckboxIcon, CheckboxFillIcon } from '../icons/index.js';

/* Check Button — Text Button shape with a required leading 24px checkbox
   glyph that flips outline → fill with the `checked` state, plus an
   optional 16px middle icon between the checkbox and the label. Sizes,
   appearances, and state recipe mirror `button/text` rung-for-rung; the
   structural delta is the always-present checkbox slot and the per-element
   4px gap (`sys.layout.inline.xs`).

   Renders as `<button>` with toggle semantics — `aria-pressed` exposes the
   checked state. Consumers wire `onClick` to flip state; this is NOT a
   form checkbox input. */
export const ButtonCheck = forwardRef(function ButtonCheck({
  children,
  state,
  size = 'medium',
  appearance = 'default',
  checked = false,
  disabled = false,
  icon,
  className,
  ...rest
}, ref) {
  const isDisabled = disabled || state === 'disabled';
  const cls = joinClasses(
    'chorus-button--check',
    `chorus-button--check--size-${size}`,
    `chorus-button--check--appearance-${appearance}`,
    className,
  );
  const CheckGlyph = checked ? CheckboxFillIcon : CheckboxIcon;
  return (
    <button
      ref={ref}
      type="button"
      className={cls}
      data-force-state={state}
      disabled={isDisabled}
      aria-pressed={checked}
      {...rest}
    >
      <span className="chorus-button--check__checkbox" aria-hidden="true">
        <CheckGlyph />
      </span>
      {icon ? (
        <span className="chorus-button--check__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="chorus-button--check__label">{children}</span>
    </button>
  );
});
