// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
import filterSpec from './specs/chip/filter.spec.json';
import tagSpec from './specs/chip/tag.spec.json';
import toggleButtonSpec from './specs/button/toggle.spec.json';
import { tokenToCss, typoStyles, joinClasses } from './spec-utils';

const FORCEABLE_STATES = new Set(['hovered', 'pressed', 'focused']);

const SPECS = {
  filter: filterSpec,
  tag: tagSpec,
  'toggle': toggleButtonSpec,
};

function pickAppearance(spec, appearance) {
  const appearances = spec.appearances || {};
  if (appearance && appearances[appearance]) return appearances[appearance];
  const defaultKey = Object.keys(appearances).find((k) => appearances[k]?.default);
  if (defaultKey) return appearances[defaultKey];
  return appearances.default ?? Object.values(appearances)[0];
}

function visualStyle(spec, selected, appearance) {
  const v = spec.selectionStates
    ? spec.selectionStates[selected ? 'selected' : 'unselected']
    : pickAppearance(spec, appearance);
  const style = {
    '--chip-label': tokenToCss(v.label),
    '--chip-border-width': v.border ? tokenToCss(v.border.width) : '0px',
    '--chip-border-color': v.border ? tokenToCss(v.border.color) : 'transparent',
  };
  // Skip inline `--chip-bg` when the appearance carries a separate dark binding
  // (`backgroundDark`). Inline custom properties always beat CSS class rules,
  // which would otherwise defeat the `[data-theme="dark"]` override. The CSS
  // class is the source of truth for those appearances. For sys-color-driven
  // appearances (single theme-aware token) inline emission is safe.
  if (!v.backgroundDark) {
    style['--chip-bg'] = tokenToCss(v.background);
  }
  return style;
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
  appearance,
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
  const appearanceClass =
    !isToggle && appearance ? `chorus-chip--${spec.subcomponent}--${appearance}` : null;
  const className_ = joinClasses(
    'chorus-chip',
    `chorus-chip--${spec.subcomponent}`,
    appearanceClass,
    isSelected && 'is-selected',
    className,
  );
  const composedStyle = { ...sizingStyle(spec), ...visualStyle(spec, isSelected, appearance), ...style };

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
