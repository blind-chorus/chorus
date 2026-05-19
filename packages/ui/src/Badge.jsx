import badgeSpec from '../../../schema/components/badge/badge.spec.json';
import { tokenToCss, typoStyles, joinClasses } from './spec-utils.js';

function formatCount(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  if (value < 0) return '0';
  if (value > 99) return '99+';
  return String(Math.floor(value));
}

function sizingStyle(spec, size) {
  const s = spec.sizes[size] ?? spec.sizes.medium;
  return {
    '--badge-min-height': tokenToCss(s.minHeight),
    '--badge-min-width': tokenToCss(s.minWidth),
    '--badge-padding-block': tokenToCss(s.paddingBlock),
    '--badge-padding-inline': tokenToCss(s.paddingInline),
    ...(s.labelTypo ? typoStyles(s.labelTypo) : null),
  };
}

function appearanceStyle(spec) {
  return {
    '--badge-bg': tokenToCss(spec.appearance.background),
    '--badge-label': tokenToCss(spec.appearance.label),
    '--badge-radius': tokenToCss(spec.appearance.radius),
  };
}

const DOT_SIZES = new Set(['dot-md', 'dot-sm']);

/* Badge — numeric count pill (medium / small) plus the labelless
   **Update Dot** rungs (`dot-md` / `dot-sm`). The dot rungs render no
   label and paint a 1px `surface`-color halo as a box-shadow so the
   dot reads cleanly above any host imagery. Thumbnail's corner update
   flag is the canonical host — it picks `dot-md` at the 32 / 40 / 48
   rungs and `dot-sm` at the 16 / 20 / 24 rungs. */
export function Badge({
  size = 'medium',
  count,
  className,
  children,
  style,
  'aria-hidden': ariaHidden,
  ...rest
}) {
  const isDot = DOT_SIZES.has(size);
  const composedStyle = {
    ...sizingStyle(badgeSpec, size),
    ...appearanceStyle(badgeSpec),
    ...style,
  };

  if (isDot) {
    return (
      <span
        className={joinClasses('chorus-badge', 'chorus-badge--dot', `chorus-badge--${size}`, className)}
        style={composedStyle}
        aria-hidden={ariaHidden ?? true}
        {...rest}
      />
    );
  }

  const label = children ?? formatCount(count);
  if (label == null || label === '') return null;
  return (
    <span
      className={joinClasses('chorus-badge', `chorus-badge--${size}`, className)}
      style={composedStyle}
      aria-hidden={ariaHidden}
      {...rest}
    >
      {label}
    </span>
  );
}
