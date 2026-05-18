import filterSpec from '../../../schema/components/chip/filter.spec.json';
import tagSpec from '../../../schema/components/chip/tag.spec.json';
import toggleButtonSpec from '../../../schema/components/button/toggle.spec.json';
import { tokenToCss, typoStyles, joinClasses } from './spec-utils.js';

const FORCEABLE_STATES = new Set(['hovered', 'pressed', 'focused']);

const SPECS = {
  filter: filterSpec,
  tag: tagSpec,
  'toggle': toggleButtonSpec,
};

function visualStyle(spec, selected) {
  const v = spec.selectionStates
    ? spec.selectionStates[selected ? 'selected' : 'unselected']
    : spec.appearances.default;
  return {
    '--chip-bg': tokenToCss(v.background),
    '--chip-label': tokenToCss(v.label),
    '--chip-border-width': v.border ? tokenToCss(v.border.width) : '0px',
    '--chip-border-color': v.border ? tokenToCss(v.border.color) : 'transparent',
  };
}

function sizingStyle(spec) {
  return {
    '--chip-min-height': tokenToCss(spec.sizing.minHeight),
    '--chip-padding-block': tokenToCss(spec.sizing.paddingBlock),
    '--chip-padding-inline': tokenToCss(spec.sizing.paddingInline),
    '--chip-label-inset': tokenToCss(spec.sizing.labelInset),
    '--chip-slot-gap': tokenToCss(spec.sizing.slotGap),
    '--chip-radius': tokenToCss(spec.sizing.radius),
    '--chip-icon-size': tokenToCss(spec.sizing.iconSize),
    '--chip-overlay-hover': tokenToCss(spec.states.hovered.overlay.opacity),
    '--chip-overlay-pressed': tokenToCss(spec.states.pressed.overlay.opacity),
    '--chip-overlay-focus': tokenToCss(spec.focusIndicator.overlay.opacity),
    '--chip-disabled-opacity': tokenToCss(spec.states.disabled.containerOpacity),
    '--chip-focus-outer-width': tokenToCss(spec.focusIndicator.ring.outerWidth),
    '--chip-focus-outer-color': tokenToCss(spec.focusIndicator.ring.outerColor),
    '--chip-focus-inset-width': tokenToCss(spec.focusIndicator.ring.insetWidth),
    '--chip-focus-inset-color': tokenToCss(spec.focusIndicator.ring.insetColor),
    ...typoStyles(spec.sizing.labelTypo),
  };
}

export function Chip({
  variant = 'filter',
  selected = false,
  state,
  leadingIcon,
  trailingIcon,
  disabled = false,
  className,
  children,
  style,
  ...rest
}) {
  const spec = SPECS[variant] ?? filterSpec;
  const isToggle = Boolean(spec.selectionStates);
  const isSelected = isToggle && selected;
  const isDisabled = disabled || state === 'disabled';
  const forcedState = FORCEABLE_STATES.has(state) ? state : null;
  const className_ = joinClasses(
    'chorus-chip',
    `chorus-chip--${spec.subcomponent}`,
    isSelected && 'is-selected',
    className,
  );
  const composedStyle = { ...sizingStyle(spec), ...visualStyle(spec, isSelected), ...style };

  if (isToggle) {
    const ariaPressed = variant === 'toggle' ? Boolean(selected) : undefined;
    return (
      <button
        type="button"
        className={className_}
        disabled={isDisabled}
        data-force-state={forcedState ?? undefined}
        aria-pressed={ariaPressed}
        style={composedStyle}
        {...rest}
      >
        {leadingIcon ? <span className="chorus-chip__icon" aria-hidden="true">{leadingIcon}</span> : null}
        {children ? <span className="chorus-chip__label">{children}</span> : null}
        {trailingIcon ? <span className="chorus-chip__icon" aria-hidden="true">{trailingIcon}</span> : null}
      </button>
    );
  }

  // Tag — interactive only when trailingIcon is present (dismiss).
  const interactive = Boolean(trailingIcon);
  const Tag = interactive ? 'button' : 'span';
  return (
    <Tag
      {...(interactive ? { type: 'button', disabled: isDisabled } : {})}
      className={className_}
      data-force-state={forcedState ?? undefined}
      style={composedStyle}
      {...rest}
    >
      <span className="chorus-chip__label">{children}</span>
      {trailingIcon ? <span className="chorus-chip__icon" aria-hidden="true">{trailingIcon}</span> : null}
    </Tag>
  );
}
