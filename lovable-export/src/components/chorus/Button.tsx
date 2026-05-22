// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
import { forwardRef } from 'react';
import { ButtonStandard } from './internal/ButtonStandard';
import { ButtonFab } from './internal/ButtonFab';
import { ButtonIcon } from './internal/ButtonIcon';
import { ButtonText } from './internal/ButtonText';
import { ButtonCheck } from './internal/ButtonCheck';
import { ButtonToolbar } from './internal/ButtonToolbar';
import { ButtonToggle } from './internal/ButtonToggle';

const VARIANTS = {
  fab: ButtonFab,
  'icon': ButtonIcon,
  'text': ButtonText,
  'check': ButtonCheck,
  'toolbar': ButtonToolbar,
  'toggle': ButtonToggle,
};

/**
 * button family wrapper. Dispatches to a per-variant impl;
 * each variant's full prop contract lives in its own spec.
 *
 * @see ./specs/button/standard.spec.json — variant="standard" (default)
 * @see ./specs/button/fab.spec.json — variant="fab"
 * @see ./specs/button/icon.spec.json — variant="icon"
 * @see ./specs/button/text.spec.json — variant="text"
 * @see ./specs/button/check.spec.json — variant="check"
 * @see ./specs/button/toggle.spec.json — variant="toggle"
 * @see ./specs/button/toolbar.spec.json — variant="toolbar"
 */
export const Button = forwardRef(function Button({ variant, ...rest }, ref) {
  const Impl = (variant && VARIANTS[variant]) || ButtonStandard;
  return <Impl ref={ref} {...rest} />;
});
