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

export const Button = forwardRef(function Button({ variant, ...rest }, ref) {
  const Impl = (variant && VARIANTS[variant]) || ButtonStandard;
  return <Impl ref={ref} {...rest} />;
});
