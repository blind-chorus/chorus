'use client';

import { useMemo, useRef } from 'react';
import { Button } from './Button.jsx';
import { Header } from './Header.jsx';
import { List } from './List.jsx';
import { ChevronRightIcon } from './icons/index.js';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* NavList — labelled block of label-only nav rows (each row routes
   via an `href` / `onClick`; trailing slot carries a default chevron
   Icon Button). Reach for it on category indexes, settings menus,
   and any "pick a sub-page" surface where each row is purely a route
   target and no leading thumbnail belongs.

   Bundles a `<Header>` over `<List variant="entry">` rendered label-
   only — every row drops `thumbnail` so the entry sub's leading
   column collapses and the label sits flush at the 16 inline rail.
   `supportingText` is forwarded to the entry sub's `description`
   slot. The trailing slot is filled with a default Icon Button
   (`variant="icon"`, `size="medium"`, `icon={<ChevronRightIcon />}`)
   that mirrors the row's route; per-item `trailingIcon` overrides. */
export function NavList({
  label,
  headerAction,
  items = [],
  embedded = false,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const ref = useRef(null);
  useFullBleedGuard(ref, 'NavList');
  const entryItems = useMemo(
    () =>
      items.map(({ supportingText, trailingIcon, ...item }) => ({
        ...item,
        description: supportingText,
        trailingIcon:
          trailingIcon ?? (
            <Button
              variant="icon"
              size="medium"
              aria-label={item.label}
              icon={<ChevronRightIcon />}
              onClick={item.onClick}
            />
          ),
      })),
    [items],
  );
  return (
    <section
      ref={ref}
      className={joinClasses('chorus-nav-list', className)}
      aria-label={ariaLabel ?? label}
      data-embedded={embedded ? 'true' : undefined}
      {...rest}
    >
      <Header label={label} headerAction={headerAction} />
      <List variant="entry" embedded items={entryItems} />
    </section>
  );
}
