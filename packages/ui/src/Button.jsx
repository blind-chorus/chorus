import { forwardRef } from 'react';
import { ButtonStandard } from './internal/ButtonStandard.jsx';
import { ButtonFab } from './internal/ButtonFab.jsx';
import { ButtonIcon } from './internal/ButtonIcon.jsx';
import { ButtonText } from './internal/ButtonText.jsx';
import { ButtonCheck } from './internal/ButtonCheck.jsx';
import { ButtonToolbar } from './internal/ButtonToolbar.jsx';
import { ButtonToggle } from './internal/ButtonToggle.jsx';

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
