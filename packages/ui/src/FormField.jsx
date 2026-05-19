'use client';

import { useId, useRef, useState } from 'react';
import inputSpec from '../../../schema/components/form-field/input.spec.json';
import searchBarSpec from '../../../schema/components/form-field/search.spec.json';
import { tokenToCss, typoStyles, joinClasses } from './spec-utils.js';
import { CloseCircleFillIcon, SearchIcon } from './icons/index.js';

/* `hovered` / `pressed` / `active` are the field's interactive feedback
   states (pointer-driven in the real component). `focused` is the
   accessibility focus ring — not part of that feedback set, and in the
   docs preview it shows only when forced from the State control. All are
   reproduced via `data-force-state` on the field box. `disabled` is a
   real prop, not a forced state. */
const FORCEABLE_STATES = new Set(['hovered', 'pressed', 'active', 'focused']);

/* Internal field renderer shared by every Form field sub-component. The
   `.chorus-field` <div> is the bordered box (stroke = inset box-shadow,
   never a `border`; transparent fill); the chromeless <input> inside
   supplies the editable text, an optional **leading** decorative slot
   (Search bar's magnifier glyph), and an optional trailing clear button.
   When a `label`, `helper`, or `maxLength` is supplied the box is wrapped
   in a `.chorus-field-group` that also renders the label above and the
   assistive text / character count below — `helper` and `maxLength` are
   mutually exclusive (if both are passed, the count wins). Value can be
   controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
   The clear button is rendered whenever the value is non-empty; CSS keeps
   it hidden unless the box is focused, so it only ever shows in the
   active state with text to wipe. */
function FormFieldBox({
  spec,
  subcomponent,
  leadingSlot = null,
  appearance = spec.props.appearance.default,
  value,
  defaultValue = '',
  placeholder,
  label,
  helper,
  maxLength,
  disabled = false,
  state,
  className,
  style,
  onChange,
  onClear,
  ...rest
}) {
  const app = spec.appearances[appearance] ?? spec.appearances[spec.props.appearance.default];
  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const current = controlled ? value : inner;
  const valueLen = current == null ? 0 : String(current).length;
  const isDisabled = disabled || state === 'disabled';
  const forcedState = FORCEABLE_STATES.has(state) ? state : null;
  const showClear = !isDisabled && valueLen > 0;

  const showCount = maxLength != null;
  const showHelper = helper != null && !showCount;
  const hasGroup = label != null || showHelper || showCount;

  const inputRef = useRef(null);
  const reactId = useId();
  const inputId = `${reactId}-input`;
  const descId = `${reactId}-desc`;
  const describedBy = hasGroup && (showHelper || showCount) ? descId : undefined;

  const composedStyle = {
    '--field-min-height': tokenToCss(spec.sizing.minHeight),
    '--field-padding-block': tokenToCss(spec.sizing.paddingBlock),
    '--field-padding-inline': tokenToCss(spec.sizing.paddingInline),
    '--field-slot-gap': tokenToCss(spec.sizing.slotGap),
    '--field-radius': tokenToCss(spec.sizing.radius),
    '--field-border-width': tokenToCss(spec.sizing.borderWidth),
    '--field-active-stroke': tokenToCss(spec.sizing.activeStrokeWeight),
    '--field-icon-size': tokenToCss(spec.sizing.iconSize),
    '--field-group-gap': tokenToCss(spec.sizing.groupGap),
    '--field-bg': tokenToCss(app.background),
    '--field-bg-disabled': tokenToCss(spec.states.disabled.background),
    '--field-text': tokenToCss(app.text),
    '--field-placeholder': tokenToCss(app.placeholder),
    '--field-border': tokenToCss(app.borderRest),
    '--field-border-hover': tokenToCss(app.borderHover),
    '--field-border-active': tokenToCss(app.borderActive),
    '--field-overlay-pressed': tokenToCss(spec.states.pressed.overlay.opacity),
    '--field-disabled-opacity': tokenToCss(spec.states.disabled.containerOpacity),
    '--field-focus-outer-width': tokenToCss(spec.focusIndicator.ring.outerWidth),
    '--field-focus-outer-color': tokenToCss(spec.focusIndicator.ring.outerColor),
    '--field-focus-inset-width': tokenToCss(spec.focusIndicator.ring.insetWidth),
    '--field-focus-inset-color': tokenToCss(spec.focusIndicator.ring.insetColor),
    ...typoStyles(spec.sizing.textTypo),
  };

  const handleChange = (event) => {
    if (!controlled) setInner(event.target.value);
    onChange?.(event);
  };

  const handleClear = () => {
    if (!controlled) setInner('');
    onClear?.();
    inputRef.current?.focus();
  };

  const fieldBox = (
    <div
      className={joinClasses(
        'chorus-field',
        `chorus-field--${subcomponent}`,
        `chorus-field--${appearance}`,
        isDisabled && 'is-disabled',
        !hasGroup && className,
      )}
      data-force-state={forcedState ?? undefined}
      style={hasGroup ? undefined : { ...composedStyle, ...style }}
    >
      {leadingSlot != null ? (
        <span className="chorus-field__leading" aria-hidden="true">
          {leadingSlot}
        </span>
      ) : null}
      <input
        ref={inputRef}
        id={hasGroup && label != null ? inputId : undefined}
        type="text"
        className="chorus-field__input"
        value={current}
        placeholder={placeholder}
        disabled={isDisabled}
        maxLength={showCount ? maxLength : undefined}
        aria-describedby={describedBy}
        onChange={handleChange}
        {...(hasGroup ? {} : rest)}
      />
      {showClear ? (
        <button
          type="button"
          className="chorus-field__clear"
          aria-label="Clear"
          onClick={handleClear}
        >
          <CloseCircleFillIcon />
        </button>
      ) : null}
    </div>
  );

  if (!hasGroup) return fieldBox;

  return (
    <div
      className={joinClasses(
        'chorus-field-group',
        `chorus-field-group--${appearance}`,
        isDisabled && 'is-disabled',
        className,
      )}
      style={{ ...composedStyle, ...style }}
      {...rest}
    >
      {label != null ? (
        <label className="chorus-field-group__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      {fieldBox}
      {showHelper ? (
        <span id={descId} className="chorus-field-group__helper">
          {helper}
        </span>
      ) : null}
      {showCount ? (
        <span id={descId} className="chorus-field-group__count" aria-live="polite">
          <strong className="chorus-field-group__count-current">{valueLen}</strong>/{maxLength}
        </span>
      ) : null}
    </div>
  );
}

function FormFieldInput(props) {
  return <FormFieldBox spec={inputSpec} subcomponent="input" {...props} />;
}

/* Search bar — same field as Input with a leading `SearchIcon` pinned at
   the inner-left edge and a `sys.radius.full` pill corner. The glyph is
   decorative (`aria-hidden`); the search action is performed by the input
   itself (Enter / `onChange`). Bare box only — `label`, `helper`, and
   `maxLength` are intentionally not supported (see search.spec.json /
   .md); the affordance is the leading glyph + the placeholder, and a
   visible label / count rung competes with that rather than reinforcing
   it. The props are stripped here so a stray pass at the call site can't
   re-introduce the field-group wrapper. */
function FormFieldSearchBar({
  label: _label,
  helper: _helper,
  maxLength: _maxLength,
  appearance: _appearance,
  ...rest
}) {
  return (
    <FormFieldBox
      spec={searchBarSpec}
      subcomponent="search"
      appearance="default"
      leadingSlot={<SearchIcon />}
      {...rest}
    />
  );
}

const VARIANTS = {
  input: FormFieldInput,
  'search': FormFieldSearchBar,
};

export function FormField({ variant = 'input', ...rest }) {
  const Impl = VARIANTS[variant] ?? FormFieldInput;
  return <Impl {...rest} />;
}
