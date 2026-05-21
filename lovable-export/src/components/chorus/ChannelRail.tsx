// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
'use client';

import { useRef } from 'react';
import { Button } from './Button';
import { Thumbnail } from './Thumbnail';
import { useScrollOverflow } from './internal/useScrollOverflow';
import { joinClasses } from './spec-utils';

/* ChannelRail — a horizontal strip of channel entry points. Each item is
   an anchor that routes to a channel / company page; the rail is
   navigation, not a picker. Items compose a 48-rung Thumbnail (with
   optional updateDot / logoBadge passing through) and a single-line
   label below. An optional trailing action ("View all", "Manage") lives
   at the end of the row, vertically centred against the avatar so the
   text reads as part of the rail rhythm, not as a second row.

   Anchors are wired via standard `<a href>` so right-click / open-in-
   new-tab works. The component does not intercept clicks; routing is
   the host framework's responsibility (Next.js Link, react-router,
   etc.). If the consumer needs framework-level routing, wrap each item
   in their Link primitive and pass `as` (future). */

export function ChannelRail({
  items = [],
  trailingAction,
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
  return (
    <nav
      className={joinClasses('chorus-channel-rail', className)}
      aria-label={ariaLabel ?? 'Channels'}
      {...rest}
    >
      <div
        ref={trackRef}
        className="chorus-channel-rail__track"
      >
        {items.map((item) => (
          <a
            key={item.value}
            href={item.href ?? '#'}
            className="chorus-channel-rail__item"
            aria-label={item.ariaLabel ?? item.label}
            onClick={item.href ? undefined : (e) => e.preventDefault()}
          >
            <span className="chorus-channel-rail__avatar">
              <Thumbnail size={48} {...(item.thumbnail ?? { alt: item.label })} />
            </span>
            <span className="chorus-channel-rail__label">{item.label}</span>
          </a>
        ))}
      </div>
      {trailingAction ? (
        <Button
          variant="text"
          size="small"
          appearance="accent"
          className="chorus-channel-rail__trailing"
          href={trailingAction.href ?? '#'}
          onClick={trailingAction.onClick}
        >
          {trailingAction.label}
        </Button>
      ) : null}
    </nav>
  );
}
