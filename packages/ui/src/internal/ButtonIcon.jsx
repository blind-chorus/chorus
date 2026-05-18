import { joinClasses } from '../spec-utils.js';

/* Icon Button — the icon-only commit surface. Sized by padding
   (`sys.layout.container.xs` on every edge) around the glyph, so
   two rungs fall out of the icon scale: `large` (24-glyph → 40
   × 40, the default, page chrome) and `medium` (16-glyph → 32
   × 32, for dense affordances perched inside another control's
   chrome). Carries no visible label; consumers MUST supply
   `aria-label`. Hover / pressed paint `sys.state.*` overlays,
   focus composes the standard three-layer ring (see DESIGN.md
   → Focus ring composition). */
export function ButtonIcon({
  icon,
  size = 'large',
  appearance = 'default',
  state,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  /* Optical alignment is the **default** rendering rule — the base
     `.chorus-button--icon` style negates the capsule's 8px padding via
     negative margins on every side, so the visible glyph (not the
     transparent chrome) defines the button's layout edges. The hover
     capsule still paints on all four sides — the chrome becomes a
     hover-only affordance, not a layout participant. See
     `schema/components/button/icon.md → Behavior`. */
  return (
    <button
      type="button"
      className={joinClasses(
        'chorus-button--icon',
        `chorus-button--icon--${size}`,
        `chorus-button--icon--appearance-${appearance}`,
        state && `is-${state}`,
        className,
      )}
      aria-label={ariaLabel}
      data-force-state={state}
      {...rest}
    >
      <span className="chorus-button--icon__icon" aria-hidden="true">{icon}</span>
    </button>
  );
}
