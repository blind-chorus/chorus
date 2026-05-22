// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
import spec from '../specs/button/fab.spec.json';
import { tokenToCss, typoStyles, joinClasses } from '../spec-utils';

/** Props for Fab (fab). Generated from schema/components/button/fab.spec.json — edit there, then re-run `npm run build:lovable`. */
export interface ButtonFabProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant: string;
  appearance?: "primary" | "secondary";
  icon?: React.ReactNode;
  label?: React.ReactNode;
  children?: React.ReactNode;
}

const FORCEABLE_STATES = new Set(['hovered', 'pressed', 'focused']);

function appearanceStyle(appearance) {
  const a = spec.appearances[appearance] ?? spec.appearances[spec.props.appearance.default];
  return {
    '--button-fab-bg': tokenToCss(a.background),
    '--button-fab-label': tokenToCss(a.label),
  };
}

const sizingStyle = () => ({
  '--button-fab-min-height': tokenToCss(spec.sizing.minHeight),
  '--button-fab-padding': tokenToCss(spec.sizing.padding),
  '--button-fab-icon-size': tokenToCss(spec.sizing.iconSize),
  '--button-fab-slot-gap': tokenToCss(spec.sizing.slotGap),
  '--button-fab-label-inset': tokenToCss(spec.sizing.labelInset),
  '--button-fab-radius': tokenToCss(spec.sizing.radius),
  '--button-fab-elevation': tokenToCss(spec.sizing.elevation),
  '--button-fab-overlay-hover': tokenToCss(spec.states.hovered.overlay.opacity),
  '--button-fab-overlay-pressed': tokenToCss(spec.states.pressed.overlay.opacity),
  '--button-fab-overlay-focus': tokenToCss(spec.focusIndicator.overlay.opacity),
  '--button-fab-focus-outer-width': tokenToCss(spec.focusIndicator.ring.outerWidth),
  '--button-fab-focus-outer-color': tokenToCss(spec.focusIndicator.ring.outerColor),
  '--button-fab-focus-inset-width': tokenToCss(spec.focusIndicator.ring.insetWidth),
  '--button-fab-focus-inset-color': tokenToCss(spec.focusIndicator.ring.insetColor),
  ...typoStyles(spec.sizing.labelTypo),
});

export function ButtonFab({
  appearance = spec.props.appearance.default,
  state,
  icon,
  className,
  children,
  style,
  ...rest
}: ButtonFabProps) {
  const forcedState = FORCEABLE_STATES.has(state) ? state : null;
  const className_ = joinClasses(
    'chorus-button--fab',
    `chorus-button--button-fab--appearance-${appearance}`,
    !children && 'chorus-button--button-fab--icon-only',
    className,
  );
  const composedStyle = {
    ...sizingStyle(),
    ...appearanceStyle(appearance),
    ...style,
  };
  return (
    <button
      type="button"
      className={className_}
      data-force-state={forcedState ?? undefined}
      style={composedStyle}
      {...rest}
    >
      {icon ? <span className="chorus-button--fab__icon" aria-hidden="true">{icon}</span> : null}
      {children ? <span className="chorus-button--fab__label">{children}</span> : null}
    </button>
  );
}
