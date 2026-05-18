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
    ...typoStyles(s.labelTypo),
  };
}

function appearanceStyle(spec) {
  return {
    '--badge-bg': tokenToCss(spec.appearance.background),
    '--badge-label': tokenToCss(spec.appearance.label),
    '--badge-radius': tokenToCss(spec.appearance.radius),
  };
}

export function Badge({
  size = 'medium',
  count,
  className,
  children,
  style,
  ...rest
}) {
  const label = children ?? formatCount(count);
  if (label == null || label === '') return null;
  const composedStyle = {
    ...sizingStyle(badgeSpec, size),
    ...appearanceStyle(badgeSpec),
    ...style,
  };
  return (
    <span
      className={joinClasses('chorus-badge', `chorus-badge--${size}`, className)}
      style={composedStyle}
      {...rest}
    >
      {label}
    </span>
  );
}
