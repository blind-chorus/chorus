import { forwardRef } from 'react';
import { joinClasses } from '../spec-utils.js';

/* Text Button — the link-shaped commit surface. Reads as a `primary`-
   coloured 16/Semibold label at rest with no fill / no border, but
   paints a button-like state overlay on hover / pressed (the bare
   Text-link contract uses a 1px underline) and composes the standard
   three-layer focus ring. Sized by min-height: 40 + 8px padding so
   the control aligns with Icon Button next to it (Navigation Bar
   Page trailing slot is the canonical surface).

   Renders as <a> when `href` is given (browser open-in-new-tab,
   right-click affordances) and as <button> otherwise — keeps the
   semantic surface honest while letting consumers swap routing
   strategies without changing the rendered chrome. */
export const ButtonText = forwardRef(function ButtonText({
  children,
  href,
  state,
  size = 'medium',
  appearance = 'primary',
  disabled = false,
  leadingIcon,
  trailingIcon,
  className,
  ...rest
}, ref) {
  const isDisabled = disabled || state === 'disabled';
  /* Optical alignment is the **default** rendering rule — the base
     `.chorus-button--text` style negates the button's block / inline
     padding via negative margins on every side, so the visible label
     bounding box (not the chrome) defines the button's layout edges.
     The hover capsule still paints on all four sides — the chrome
     becomes a hover-only affordance, not a layout participant. See
     `schema/components/button/text.md → Behavior`. */
  const cls = joinClasses(
    'chorus-button--text',
    `chorus-button--text--size-${size}`,
    `chorus-button--text--appearance-${appearance}`,
    state && `is-${state}`,
    className,
  );
  const props = {
    className: cls,
    'data-force-state': state,
    ...rest,
  };
  if (href == null) {
    props.disabled = isDisabled;
  } else if (isDisabled) {
    props['aria-disabled'] = 'true';
  }
  /* Icon slots wrap in `<span aria-hidden>` so the glyph stays decorative
     and the button's accessible name is the label text. The 24px footprint
     and the 8px label-gap are paid by `.chorus-button--text__icon` /
     `.chorus-button--text { gap }` respectively — see styles.css. */
  const content = (
    <>
      {leadingIcon ? <span className="chorus-button--text__icon" aria-hidden="true">{leadingIcon}</span> : null}
      <span className="chorus-button--text__label">{children}</span>
      {trailingIcon ? <span className="chorus-button--text__icon" aria-hidden="true">{trailingIcon}</span> : null}
    </>
  );
  if (href != null) {
    return <a ref={ref} href={href} {...props}>{content}</a>;
  }
  return <button ref={ref} type="button" {...props}>{content}</button>;
});
