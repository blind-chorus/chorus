'use client';

import { useRef } from 'react';
import { ChevronDownIcon } from './icons/index.js';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* NavCard — a single bounded drill-in navigation card. Outlined rounded
   surface with leading label, optional supporting line, and an auto-rendered
   trailing chevron. Whole card is the tap target. Renders <button> by default,
   <a href> when `href` is set. See schema/components/nav-card/nav-card.md. */

export function NavCard({
  label,
  supportingText,
  leading,
  trailingIcon,
  variant = 'default',
  appearance = 'default',
  href,
  onClick,
  disabled = false,
  forcedState,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const ref = useRef(null);
  useFullBleedGuard(ref, 'NavCard');

  /* `default` ships no trailing affordance — the card is a labelled
     surface with an optional leading slot. `nav` auto-renders the
     drill-in chevron. A consumer-supplied `trailingIcon` overrides on
     either variant (e.g. an external-link glyph or expand-down arrow). */
  const trailing = trailingIcon ?? (variant === 'nav' ? <ChevronRightGlyph /> : null);
  const sharedProps = {
    ref,
    className: joinClasses(
      'chorus-nav-card',
      variant !== 'default' && `chorus-nav-card--variant-${variant}`,
      appearance !== 'default' && `chorus-nav-card--${appearance}`,
      className,
    ),
    'aria-label': ariaLabel ?? label,
    'data-force-state': forcedState ?? undefined,
    'data-disabled': disabled ? 'true' : undefined,
    ...rest,
  };

  const body = (
    <>
      {leading ? <span className="chorus-nav-card__leading">{leading}</span> : null}
      <span className="chorus-nav-card__label-col">
        <span className="chorus-nav-card__label">{label}</span>
        {supportingText ? (
          <span className="chorus-nav-card__supporting">{supportingText}</span>
        ) : null}
      </span>
      {trailing ? (
        <span className="chorus-nav-card__trailing" aria-hidden="true">
          {trailing}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        {...sharedProps}
        href={disabled ? undefined : href}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        aria-disabled={disabled || undefined}
      >
        {body}
      </a>
    );
  }
  return (
    <button
      type="button"
      {...sharedProps}
      onClick={onClick}
      disabled={disabled}
    >
      {body}
    </button>
  );
}

/* Right-pointing chevron, derived from the down-chevron glyph rotated 270°.
   Re-using the existing icon avoids shipping a duplicate ChevronRight SVG
   (it's also how list/nav renders its trailing chevron). The rotation is
   scoped to the trailing slot via the .chorus-nav-card__trailing class
   so it never affects a consumer-supplied custom trailingIcon. */
function ChevronRightGlyph() {
  return (
    <span
      className="chorus-nav-card__chevron"
      style={{ display: 'inline-flex', transform: 'rotate(-90deg)' }}
    >
      <ChevronDownIcon size={16} />
    </span>
  );
}

/* NavCardGroup — vertical stack of NavCards with a fixed `sys.layout.stack.xs`
   (8px) gap. Owns no padding of its own and never paints chrome — each child
   NavCard stays its own outlined surface. Reach for it when several drill-in
   cards belong to one logical section but should read as discrete cards (vs
   a list/nav rail where rows tile flush with hairline dividers). */
export function NavCardGroup({
  className,
  children,
  'aria-label': ariaLabel,
  ...rest
}) {
  return (
    <div
      className={joinClasses('chorus-nav-card-group', className)}
      role="group"
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </div>
  );
}
