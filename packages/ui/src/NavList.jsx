'use client';

import { useRef } from 'react';
import { Header } from './Header.jsx';
import { List } from './List.jsx';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* NavList — labelled block of label-only nav rows (each row routes
   via an `href` / `onClick`; trailing chevron is supplied by the
   list/nav variant). Reach for it on category indexes, settings
   menus, and any "pick a sub-page" surface where each row is purely
   a route target and no leading thumbnail belongs.

   The row chrome (typography, divider, focus ring, chevron) is
   inherited verbatim from `<List variant="nav">`. NavList only owns
   the section header + the surface chrome that wraps it. */
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
  return (
    <section
      ref={ref}
      className={joinClasses('chorus-nav-list', className)}
      aria-label={ariaLabel ?? label}
      data-embedded={embedded ? 'true' : undefined}
      {...rest}
    >
      <Header label={label} headerAction={headerAction} />
      <List variant="nav" embedded items={items} />
    </section>
  );
}
