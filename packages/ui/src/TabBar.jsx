'use client';

import { isValidElement } from 'react';
import { joinClasses } from './spec-utils.js';

/* TabBar — the bottom tab bar. A horizontal strip pinned to the bottom of
   the app surface that exposes the top-level destinations (Home / Company /
   Explore / Jobs / Notifications …) in one tap. Each item stacks a 24px
   glyph above a 10px label; the active item is signalled by the filled
   companion glyph + `onSurface` colour, inactive items render the outline
   glyph in `onSurfaceVariant`.

   Items are distributed with `justify-content: space-evenly`, which makes
   the row's start padding, the gap between adjacent items, and the row's
   end padding all the same visible whitespace — the optical-alignment
   rule the bar's spec calls for so the icons read as evenly placed across
   the row regardless of label width.

   An item may opt into `appearance="primary"` to render a tile-shaped
   commit affordance (a primary-filled rounded square hosting the glyph)
   — the conventional "Create" / "Compose" entry at the trailing end of
   the bar. The label still sits below at the same 10/Regular rung so the
   item shares the row's vertical rhythm. */

function TabBarItem({ item, isActive, onSelect }) {
  const {
    value,
    label,
    icon,
    activeIcon,
    href,
    onClick,
    appearance,
    forcedState,
    'aria-label': ariaLabel,
  } = item;

  const glyph = isActive && activeIcon ? activeIcon : icon;
  const isPrimary = appearance === 'primary';

  const className = joinClasses(
    'chorus-tab-bar__item',
    isPrimary && 'chorus-tab-bar__item--primary',
    isActive && !isPrimary && 'is-active',
  );

  const content = (
    <>
      <span className="chorus-tab-bar__icon" aria-hidden={label ? 'true' : undefined}>
        {isValidElement(glyph) ? glyph : null}
      </span>
      {label ? <span className="chorus-tab-bar__label">{label}</span> : null}
    </>
  );

  const handleClick = (event) => {
    onClick?.(event);
    /* Primary items invoke a screen-covering overlay rather than a
       sibling destination — they never own selection inside the bar,
       so suppress the selection callback for them. */
    if (!event.defaultPrevented && !isPrimary) onSelect?.(value);
  };

  if (href) {
    return (
      <a
        className={className}
        href={href}
        aria-current={isActive ? 'page' : undefined}
        aria-label={ariaLabel}
        data-force-state={forcedState ?? undefined}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={className}
      aria-current={isActive ? 'page' : undefined}
      aria-label={ariaLabel}
      data-force-state={forcedState ?? undefined}
      onClick={handleClick}
    >
      {content}
    </button>
  );
}

export function TabBar({
  items,
  value,
  onChange,
  'aria-label': ariaLabel = 'Primary',
  className,
  ...rest
}) {
  const rows = Array.isArray(items) ? items : [];
  return (
    <nav
      className={joinClasses('chorus-tab-bar', className)}
      aria-label={ariaLabel}
      {...rest}
    >
      {rows.map((item) => (
        <TabBarItem
          key={item.value}
          item={item}
          isActive={item.value === value}
          onSelect={onChange}
        />
      ))}
    </nav>
  );
}
