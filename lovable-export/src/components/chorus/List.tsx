// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { ExpandIcon, RadioIcon, RadioFillIcon } from './icons/index';
import { Thumbnail } from './Thumbnail';
import { joinClasses } from './spec-utils';

/* List — vertical sequence of rows for menus, settings panels, picker
   sheets. One anatomy (row: leading + label column + trailing) drives
   two interaction models via `variant`:
     - text  (default): rows fire `onClick` per item; no selection state
     - radio:           single-select picker — controlled via `value` +
                        `onChange(value)` on the List itself

   The whole row is the interactive target in both variants. The leading
   radio indicator is decorative — keyboard focus, hover overlay, and
   click target all sit on the row. */

function RadioIndicator({ selected }) {
  const Glyph = selected ? RadioFillIcon : RadioIcon;
  return (
    <span className={joinClasses('chorus-list__radio', selected && 'is-selected')} aria-hidden="true">
      <Glyph size={16} />
    </span>
  );
}

/**
 * list family wrapper. Dispatches to a per-variant impl;
 * each variant's full prop contract lives in its own spec.
 *
 * @see ./specs/list/text.spec.json — variant="text" (default)
 * @see ./specs/list/radio.spec.json — variant="radio"
 * @see ./specs/list/thumbnail.spec.json — variant="thumbnail"
 * @see ./specs/list/nav.spec.json — variant="nav"
 */
export function List({
  variant = 'text',
  value,
  onChange,
  items = [],
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const isRadio = variant === 'radio';
  const role = isRadio ? 'radiogroup' : 'list';
  const groupName = useId();
  const rowsRef = useRef([]);
  const [focusIndex, setFocusIndex] = useState(0);

  const onRowKey = useCallback(
    (e, idx, item) => {
      const last = items.length - 1;
      let next = idx;
      if (e.key === 'ArrowDown') next = idx === last ? 0 : idx + 1;
      else if (e.key === 'ArrowUp') next = idx === 0 ? last : idx - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      else if ((e.key === ' ' || e.key === 'Enter') && isRadio) {
        e.preventDefault();
        if (!item.disabled) onChange?.(item.value);
        return;
      } else {
        return;
      }
      e.preventDefault();
      setFocusIndex(next);
      rowsRef.current[next]?.focus();
    },
    [items, isRadio, onChange],
  );

  return (
    <div
      className={joinClasses('chorus-list', `chorus-list--${variant}`, className)}
      role={role}
      aria-label={ariaLabel}
      {...rest}
    >
      {items.map((item, idx) => {
        const selected = isRadio && item.value === value;
        const isFocusable = idx === focusIndex;
        const onClick = () => {
          if (item.disabled) return;
          if (isRadio) onChange?.(item.value);
          item.onClick?.();
        };
        return (
          <div
            key={item.value ?? idx}
            ref={(el) => { rowsRef.current[idx] = el; }}
            role={isRadio ? 'radio' : 'listitem'}
            aria-checked={isRadio ? selected : undefined}
            aria-disabled={item.disabled || undefined}
            tabIndex={item.disabled ? -1 : (isFocusable ? 0 : -1)}
            data-selected={selected || undefined}
            data-force-state={item.forcedState ?? undefined}
            className={joinClasses(
              'chorus-list__row',
              selected && 'is-selected',
              item.disabled && 'is-disabled',
            )}
            onClick={onClick}
            onKeyDown={(e) => onRowKey(e, idx, item)}
            onFocus={() => setFocusIndex(idx)}
            data-group={isRadio ? groupName : undefined}
          >
            {isRadio ? (
              <span className="chorus-list__leading">
                <RadioIndicator selected={selected} />
              </span>
            ) : variant === 'thumbnail' ? (
              <span className="chorus-list__leading">
                <Thumbnail size={40} {...(item.thumbnail ?? { alt: item.label })} />
              </span>
            ) : null}
            <span className="chorus-list__label-col">
              <span className="chorus-list__label">{item.label}</span>
              {item.supportingText ? (
                <span className="chorus-list__supporting">{item.supportingText}</span>
              ) : null}
            </span>
            {variant === 'nav' && !item.trailingIcon ? (
              <span className="chorus-list__trailing chorus-list__nav-chevron" aria-hidden="true">
                <ExpandIcon size={16} />
              </span>
            ) : item.trailingIcon ? (
              <span className="chorus-list__trailing" aria-hidden="true">
                {item.trailingIcon}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
