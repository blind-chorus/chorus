'use client';

import { createContext, useContext, useId, useMemo, useRef, useState } from 'react';
import { ChevronDownIcon } from './icons/index.js';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* Accordion — vertical stack of expandable rows. Each item has a trigger
   header (label + auto-rendered trailing chevron that rotates on expand)
   and a content body that animates open below it. `type="single"` allows
   one expanded item at a time; `type="multiple"` allows any number. See
   schema/components/accordion/accordion.md. */

const AccordionContext = createContext(null);

export function Accordion({
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  children,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const isControlled = value !== undefined;

  const normalizeInitial = () => {
    if (defaultValue == null) return type === 'multiple' ? [] : null;
    if (type === 'multiple') return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    return defaultValue;
  };

  const [internal, setInternal] = useState(normalizeInitial);
  const current = isControlled ? value : internal;

  const setValue = (next) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const isOpen = (itemValue) =>
    type === 'multiple'
      ? Array.isArray(current) && current.includes(itemValue)
      : current === itemValue;

  const toggle = (itemValue) => {
    if (type === 'multiple') {
      const arr = Array.isArray(current) ? current : [];
      setValue(arr.includes(itemValue) ? arr.filter((v) => v !== itemValue) : [...arr, itemValue]);
      return;
    }
    if (current === itemValue) {
      if (collapsible) setValue(null);
    } else {
      setValue(itemValue);
    }
  };

  const ref = useRef(null);
  useFullBleedGuard(ref, 'Accordion');

  const ctx = useMemo(() => ({ type, isOpen, toggle }), [type, current, collapsible]);

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        className={joinClasses('chorus-accordion', className)}
        {...rest}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  value,
  label,
  disabled = false,
  forcedState,
  children,
  className,
  ...rest
}) {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error('Accordion.Item must be rendered inside <Accordion>.');
  }
  const contentId = useId();
  const open = ctx.isOpen(value);

  return (
    <div
      className={joinClasses('chorus-accordion__item', className)}
      data-state={open ? 'open' : 'closed'}
      data-disabled={disabled ? 'true' : undefined}
      {...rest}
    >
      <button
        type="button"
        className="chorus-accordion__trigger"
        aria-expanded={open}
        aria-controls={contentId}
        disabled={disabled}
        data-force-state={forcedState ?? undefined}
        onClick={() => {
          if (disabled) return;
          ctx.toggle(value);
        }}
      >
        <span className="chorus-accordion__label">{label}</span>
        <span className="chorus-accordion__chevron" aria-hidden="true">
          <ChevronDownIcon size={16} />
        </span>
      </button>
      <div
        id={contentId}
        role="region"
        className="chorus-accordion__content"
        hidden={!open}
      >
        <div className="chorus-accordion__content-inner">{children}</div>
      </div>
    </div>
  );
}

Accordion.Item = AccordionItem;
