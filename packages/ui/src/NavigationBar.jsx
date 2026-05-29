'use client';

import { isValidElement, useState, useRef, useEffect } from 'react';
import { Button } from './Button.jsx';
import { ChevronLeftIcon, XCircleFillIcon, MenuIcon } from './icons/index.js';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* NavigationBar — the top app bar. Two sub-flavors share one component
   (`variant="home" | "page"`), each rendering a single horizontal strip
   with 16px inline + 8px block padding and a 56px min-height over
   `sys.color.surface`.

   Home — left-aligned page title (typo.heading.lg, 24/Semibold) with a
   conventional leading menu icon and up to three trailing action icons.
   Page — three-column grid (leading / centred title / trailing) with a
   smaller title (typo.heading.sm, 16/Semibold) and a single trailing
   slot that takes an icon, a labelled button, or an inline text link.

   Icon slots render as a plain `<button>` with a 24px glyph, a
   transparent rest fill, and the system's hover / pressed / focus
   overlays painted via the same `state.*` rule every other control
   uses. Not delegated to Toolbar Button — Toolbar Button is the Filter
   chip chrome (32px capsule, 16px icon) and shrinks the nav bar's
   glyphs out of the 24-rung the spec calls for. */

function isIconDescriptor(value) {
  return value && typeof value === 'object' && !isValidElement(value) && 'icon' in value;
}
function isLinkDescriptor(value) {
  return value && typeof value === 'object' && !isValidElement(value) && 'label' in value && !('icon' in value);
}

/* Every icon slot in the bar renders as the canonical Icon Button
   sub-component (`Button variant="icon"`) so the bar's hit
   target, hover overlay, and focus ring stay aligned with every other
   icon-only surface in the system without duplicating chrome. */
function IconSlot({ icon, 'aria-label': ariaLabel, onClick, size = 'large' }) {
  return (
    <Button variant="icon" size={size} icon={icon} aria-label={ariaLabel} onClick={onClick} />
  );
}

function renderSlot(slot) {
  if (slot == null) return null;
  if (isValidElement(slot)) return slot;
  if (isIconDescriptor(slot)) return <IconSlot {...slot} />;
  if (isLinkDescriptor(slot)) {
    const { label, href, onClick } = slot;
    return (
      <Button variant="text" href={href} onClick={onClick}>{label}</Button>
    );
  }
  return null;
}

export function NavigationBar({
  variant = 'home',
  /* Page variant — `surface` (default, opaque page chrome) or `overlay`
     (transparent + fixed-white icons, for floating over a hero / cover
     image such as inside ProfileHeader). Ignored on home / search. */
  appearance = 'surface',
  title,
  /* Home variant — drawer trigger. The icon itself is fixed (always the
     menu glyph); consumers only wire onClick + the a11y label. */
  onMenuClick,
  menuLabel = 'Open menu',
  /* Page variant — leading slot accepts a node or `{ icon, ... }`. */
  leading,
  leadingLabel,
  /* Home variant — up to three trailing icon descriptors. */
  trailingActions,
  /* Page variant — single trailing slot (icon / button / link / node). */
  trailing,
  /* Search variant — bare-input bar with leading back + conditional clear. */
  value,
  defaultValue,
  placeholder,
  onChange,
  onSubmit,
  onBack,
  backLabel = 'Back',
  clearLabel = 'Clear search',
  autoFocus = true,
  className,
  ...rest
}) {
  const ref = useRef(null);
  useFullBleedGuard(ref, 'NavigationBar');
  if (variant === 'search') {
    return (
      <SearchBar
        forwardRef={ref}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder ?? 'Search by keyword'}
        onChange={onChange}
        onSubmit={onSubmit}
        onBack={onBack}
        backLabel={backLabel}
        clearLabel={clearLabel}
        autoFocus={autoFocus}
        className={className}
        {...rest}
      />
    );
  }

  if (variant === 'page') {
    const leadingEl = leading
      ? renderSlot(isIconDescriptor(leading) || isLinkDescriptor(leading) || isValidElement(leading)
          ? leading
          : { icon: leading, 'aria-label': leadingLabel })
      : null;
    const trailingEl = renderSlot(trailing);
    return (
      <header
        ref={ref}
        className={joinClasses(
          'chorus-navigation-bar',
          'chorus-navigation-bar--page',
          appearance === 'overlay' && 'chorus-navigation-bar--overlay',
          className,
        )}
        data-appearance={appearance}
        {...rest}
      >
        <div className="chorus-navigation-bar__slot chorus-navigation-bar__slot--leading">{leadingEl}</div>
        <h1 className="chorus-navigation-bar__title">{title}</h1>
        <div className="chorus-navigation-bar__slot chorus-navigation-bar__slot--trailing">{trailingEl}</div>
      </header>
    );
  }

  /* Home — fixed leading menu glyph + left-aligned title + 0..3 trailing icons. */
  const actions = Array.isArray(trailingActions) ? trailingActions : [];
  return (
    <header
      ref={ref}
      className={joinClasses('chorus-navigation-bar', 'chorus-navigation-bar--home', className)}
      {...rest}
    >
      <div className="chorus-navigation-bar__slot chorus-navigation-bar__slot--leading">
        <IconSlot icon={<MenuIcon />} aria-label={menuLabel} onClick={onMenuClick} />
      </div>
      <h1 className="chorus-navigation-bar__title">{title}</h1>
      {actions.length > 0 ? (
        <div className="chorus-navigation-bar__slot chorus-navigation-bar__slot--trailing">
          {actions.map((action, i) => {
            const el = renderSlot(action);
            return el ? <span key={i} className="chorus-navigation-bar__action">{el}</span> : null;
          })}
        </div>
      ) : null}
    </header>
  );
}

/* Search — three-column grid like Page, but the centre slot is a bare
   single-line input (no border, no fill — the bar carries the search
   affordance via the placeholder + page context, not via a pill chrome).
   The trailing column hosts a clear (×) Icon Button only when the value
   is non-empty; the input column expands to fill the freed space when
   the clear collapses, but never reflows its leading edge so the caret
   stays pixel-stable. The variant has no `disabled` state — gating
   belongs on the trigger that routes here, never on the bar itself. */
function SearchBar({
  forwardRef,
  value,
  defaultValue,
  placeholder,
  onChange,
  onSubmit,
  onBack,
  backLabel,
  clearLabel,
  autoFocus,
  className,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const current = isControlled ? value : internalValue;
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  function commit(next) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit?.(current);
      return;
    }
    if (event.key === 'Escape') {
      if (current !== '') {
        event.preventDefault();
        commit('');
        return;
      }
      event.preventDefault();
      onBack?.();
    }
  }

  function handleClear() {
    commit('');
    inputRef.current?.focus();
  }

  const showClear = current !== '';

  return (
    <header
      ref={forwardRef}
      className={joinClasses('chorus-navigation-bar', 'chorus-navigation-bar--search', className)}
      {...rest}
    >
      <div className="chorus-navigation-bar__slot chorus-navigation-bar__slot--leading">
        <IconSlot icon={<ChevronLeftIcon />} aria-label={backLabel} onClick={onBack} />
      </div>
      <input
        ref={inputRef}
        type="search"
        className="chorus-navigation-bar__search-input"
        value={current}
        placeholder={placeholder}
        onChange={(e) => commit(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {showClear ? (
        <div className="chorus-navigation-bar__slot chorus-navigation-bar__slot--trailing">
          {/* size="medium" → 32 × 32 / 16-glyph Icon Button. The clear is a
              secondary affordance (the user's primary act on this bar is
              typing); a 40 × 40 / 24-glyph capsule would over-claim weight
              against the bare input next to it. */}
          <IconSlot icon={<XCircleFillIcon />} aria-label={clearLabel} onClick={handleClear} size="medium" />
        </div>
      ) : null}
    </header>
  );
}
