// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
import spec from '../specs/button/standard.spec.json';
import { tokenToCss, typoStyles, joinClasses } from '../spec-utils';

function sizeStyle(size) {
  const s = spec.sizes[size] ?? spec.sizes[spec.props.size.default];
  return {
    '--button-standard-padding-block': tokenToCss(s.paddingBlock),
    '--button-standard-padding-inline': tokenToCss(s.paddingInline),
    '--button-standard-gap': tokenToCss(s.gap),
    '--button-standard-min-height': tokenToCss(s.minHeight),
    '--button-standard-min-width': tokenToCss(s.minWidth),
    '--button-standard-radius': tokenToCss(s.radius),
    '--button-standard-icon-size': tokenToCss(s.iconSize),
    ...typoStyles(s.labelTypo),
  };
}

function appearanceStyle(appearance) {
  const a = spec.appearances[appearance] ?? spec.appearances[spec.props.appearance.default];
  return {
    '--button-standard-bg': tokenToCss(a.background),
    '--button-standard-label': tokenToCss(a.label),
    '--button-standard-border-width': a.border ? tokenToCss(a.border.width) : '0px',
    '--button-standard-border-color': a.border ? tokenToCss(a.border.color) : 'transparent',
  };
}

function stateStyle() {
  return {
    '--button-standard-overlay-hover': tokenToCss(spec.states.hovered.overlay.opacity),
    '--button-standard-overlay-pressed': tokenToCss(spec.states.pressed.overlay.opacity),
    '--button-standard-overlay-focus': tokenToCss(spec.focusIndicator.overlay.opacity),
    '--button-standard-disabled-opacity': tokenToCss(spec.states.disabled.containerOpacity),
    '--button-standard-focus-outer-width': tokenToCss(spec.focusIndicator.ring.outerWidth),
    '--button-standard-focus-outer-color': tokenToCss(spec.focusIndicator.ring.outerColor),
    '--button-standard-focus-inset-width': tokenToCss(spec.focusIndicator.ring.insetWidth),
    '--button-standard-focus-inset-color': tokenToCss(spec.focusIndicator.ring.insetColor),
  };
}

const FORCEABLE_STATES = new Set(['hovered', 'pressed', 'focused']);

export function ButtonStandard({
  appearance = spec.props.appearance.default,
  size = spec.props.size.default,
  state,
  leadingIcon,
  fullWidth = false,
  truncate = false,
  disabled = false,
  className,
  children,
  style,
  ...rest
}) {
  const isDisabled = disabled || state === 'disabled';
  const forcedState = FORCEABLE_STATES.has(state) ? state : null;
  const className_ = joinClasses(
    'chorus-button--standard',
    `chorus-button--standard--appearance-${appearance}`,
    `chorus-button--standard--size-${size}`,
    fullWidth && 'chorus-button--standard--full-width',
    truncate && 'chorus-button--standard--truncate',
    className,
  );
  const composedStyle = {
    ...sizeStyle(size),
    ...appearanceStyle(appearance),
    ...stateStyle(),
    ...style,
  };
  return (
    <button
      type="button"
      className={className_}
      disabled={isDisabled}
      data-force-state={forcedState ?? undefined}
      style={composedStyle}
      {...rest}
    >
      {leadingIcon ? (
        <span className="chorus-button--standard__icon" aria-hidden="true">{leadingIcon}</span>
      ) : null}
      <span className="chorus-button--standard__label">{children}</span>
    </button>
  );
}
