import { Chip } from '../Chip.jsx';
import { joinClasses } from '../spec-utils.js';

/* Toolbar Button is a one-shot inline action whose `secondary` appearance
   delegates verbatim to Filter chip's unselected state — same min-height,
   padding, radius, label rung, icon size, hover/pressed/focus overlays,
   and focus ring. The semantic divergence (Toolbar Button fires an
   action; Filter toggles a selection) lives in the consumer's handler,
   not in the rendered DOM, so we let the chip render the chrome.

   `appearance="primary"` adds a class modifier that overrides the
   `--chip-bg` / `--chip-label` plumbing vars to a primary fill — for the
   one Toolbar Button on a surface that IS the commit affordance (Page
   bar's "Save", sheet's "Confirm"). The size, padding, radius, focus
   ring, and state overlays still come from Filter chip — only the
   colour pair flips. */
export function ButtonToolbar({ appearance = 'secondary', className, style, ...rest }) {
  const cls = joinClasses(
    appearance === 'primary' && 'chorus-button--toolbar--primary',
    className,
  );
  /* The override goes through `style` (not a CSS class) because Chip
     emits the chip plumbing vars (`--chip-bg`, `--chip-label`,
     `--chip-border-color`) inline at render time, and CSS class rules
     can't beat inline-style specificity. Chip merges this `style` last
     in its `composedStyle`, so our overrides win cleanly. The
     `chorus-button--toolbar--primary` class is kept as a static-markup
     parity hook — see styles.css. */
  const primaryStyle = appearance === 'primary' ? {
    '--chip-bg': 'var(--sys-color-primary)',
    '--chip-label': 'var(--sys-color-onPrimary)',
    '--chip-border-color': 'transparent',
  } : null;
  return (
    <Chip
      variant="filter"
      className={cls}
      style={primaryStyle ? { ...primaryStyle, ...style } : style}
      {...rest}
    />
  );
}
