'use client';

import { useRef } from 'react';
import { Button } from './Button.jsx';
import { Thumbnail } from './Thumbnail.jsx';
import { useScrollOverflow } from './internal/useScrollOverflow.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';
import { joinClasses } from './spec-utils.js';

/* AvatarRail — a horizontal strip of avatar entry points. Each item is
   an anchor that routes to an entity (channel, person, brand, topic)
   page; the rail is navigation, not a picker. Items compose a 48-rung
   Thumbnail (with optional updateDot / logoBadge passing through) and
   a single-line label below. An optional trailing action ("View all", "Manage") lives
   at the end of the row, vertically centred against the avatar so the
   text reads as part of the rail rhythm, not as a second row.

   Anchors are wired via standard `<a href>` so right-click / open-in-
   new-tab works. The component does not intercept clicks; routing is
   the host framework's responsibility (Next.js Link, react-router,
   etc.). If the consumer needs framework-level routing, wrap each item
   in their Link primitive and pass `as` (future). */

export function AvatarRail({
  items = [],
  trailingAction,
  embedded = false,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  /* Edge fade overflow detection — shared `useScrollOverflow` hook
     toggles `data-overflow-end` / `data-overflow-start` on the track,
     same affordance pattern Tabs uses. CSS gates the trailing-edge
     `mask-image` on `[data-overflow-end="true"]` so the fade paints
     only when content actually lives past the visible edge. */
  const trackRef = useRef(null);
  useScrollOverflow(trackRef);
  const rootRef = useRef(null);
  useFullBleedGuard(rootRef, 'AvatarRail');
  return (
    <nav
      ref={rootRef}
      className={joinClasses('chorus-avatar-rail', className)}
      aria-label={ariaLabel ?? 'Entities'}
      data-embedded={embedded ? 'true' : undefined}
      {...rest}
    >
      <div
        ref={trackRef}
        className="chorus-avatar-rail__track"
      >
        {items.map((item) => (
          <a
            key={item.value}
            href={item.href ?? '#'}
            className="chorus-avatar-rail__item"
            aria-label={item.ariaLabel ?? item.label}
            onClick={item.href ? undefined : (e) => e.preventDefault()}
          >
            <span className="chorus-avatar-rail__avatar">
              <Thumbnail size={48} {...(item.thumbnail ?? { alt: item.label })} />
            </span>
            <span className="chorus-avatar-rail__label">{item.label}</span>
          </a>
        ))}
      </div>
      {trailingAction ? (
        <Button
          variant="text"
          size="small"
          appearance="accent"
          className="chorus-avatar-rail__trailing"
          href={trailingAction.href ?? '#'}
          onClick={trailingAction.onClick}
        >
          {trailingAction.label}
        </Button>
      ) : null}
    </nav>
  );
}
