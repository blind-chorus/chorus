import { Chip } from '../Chip.jsx';
import { joinClasses } from '../spec-utils.js';

/* Toolbar Button is a one-shot inline action whose `default` appearance
   delegates verbatim to Filter chip's unselected state — same min-height,
   padding, radius, label rung, icon size, hover/pressed/focus overlays,
   and focus ring. The semantic divergence (Toolbar Button fires an
   action; Filter toggles a selection) lives in the consumer's handler,
   not in the rendered DOM, so we let the chip render the chrome.

   `appearance="accent"` adds a class modifier that overrides the
   `--chip-bg` / `--chip-label` plumbing vars to a primary fill — for the
   one Toolbar Button on a surface that IS the commit affordance (Page
   bar's "Save", sheet's "Confirm"). `appearance="inverse"` swaps in the
   inverse-cluster pair (`inverseSurface` / `inverseOnSurface`) so the
   button reads as part of an inverse host (snackbars, coach-marks). The
   size, padding, radius, focus ring, and state overlays still come from
   Filter chip — only the colour pair flips. */
export function ButtonToolbar({ appearance = 'default', className, style, ...rest }) {
  const cls = joinClasses(
    appearance !== 'default' && `chorus-button--toolbar--${appearance}`,
    className,
  );
  /* The override goes through `style` (not a CSS class) because Chip
     emits the chip plumbing vars (`--chip-bg`, `--chip-label`,
     `--chip-border-color`) inline at render time, and CSS class rules
     can't beat inline-style specificity. Chip merges this `style` last
     in its `composedStyle`, so our overrides win cleanly. The
     `chorus-button--toolbar--<appearance>` class is kept as a static-
     markup parity hook — see styles.css. */
  let pairStyle = null;
  if (appearance === 'accent') {
    pairStyle = {
      '--chip-bg': 'var(--sys-color-primary)',
      '--chip-label': 'var(--sys-color-onPrimary)',
      '--chip-border-color': 'transparent',
    };
  } else if (appearance === 'inverse') {
    pairStyle = {
      '--chip-bg': 'var(--sys-color-inverseSurface)',
      '--chip-label': 'var(--sys-color-inverseOnSurface)',
      '--chip-border-color': 'transparent',
    };
  }
  return (
    <Chip
      variant="filter"
      className={cls}
      style={pairStyle ? { ...pairStyle, ...style } : style}
      {...rest}
    />
  );
}
