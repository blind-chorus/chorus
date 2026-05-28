'use client';

import { useRef } from 'react';
import { Button } from './Button.jsx';
import { List } from './List.jsx';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* SuggestionList — a vertically-stacked block of follow suggestions
   rendered as a swipeable pager. Each page shows exactly three rows
   that follow the [list/entry](../../schema/components/list/entry.md)
   visual contract at the `xlarge` rung (56 Thumbnail + identity group
   of label + secondary follower count flush with line-height-only
   spacing + description with `ref.space.25` (2) separator + trailing
   Toggle Button). The next page peeks at the trailing side of the
   viewport to invite the horizontal swipe. Anatomy is entity-agnostic
   — suggested channels, people, companies, topics all share the same
   shape.

   The component is presentation-only for the row body — tapping the
   avatar / text column does not route. The only commit affordance per
   row is the trailing Toggle Button (own hit target, stops click
   propagation); `active` state is owned by the consumer (forwarded
   through each item's `active` + `onToggle`).
   Pages of three are a hard contract: when `items.length` is not a
   multiple of three, the last page is padded with empty placeholders
   so the swipe rhythm holds. */

const ROWS_PER_PAGE = 3;

function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  if (out.length === 0) return out;
  const last = out[out.length - 1];
  while (last.length < size) last.push(null);
  return out;
}

export function SuggestionList({
  label,
  headerAction,
  items = [],
  followLabel = 'Follow',
  followingLabel = 'Following',
  embedded = false,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const pages = chunk(items, ROWS_PER_PAGE);
  const ref = useRef(null);
  useFullBleedGuard(ref, 'SuggestionList');
  return (
    <section
      ref={ref}
      className={joinClasses('chorus-suggestion-list', className)}
      aria-label={ariaLabel ?? label}
      data-embedded={embedded ? 'true' : undefined}
      {...rest}
    >
      {(label || headerAction) ? (
        <header className="chorus-suggestion-list__header">
          {label ? <h3 className="chorus-suggestion-list__label">{label}</h3> : <span />}
          {headerAction ? (
            <Button
              variant="text"
              size="xsmall"
              appearance="accent"
              className="chorus-suggestion-list__header-action"
              href={headerAction.href ?? '#'}
              onClick={headerAction.onClick}
            >
              {headerAction.label}
            </Button>
          ) : null}
        </header>
      ) : null}
      <div className="chorus-suggestion-list__pager" role="group" aria-label="Suggestion pages">
        {pages.map((page, pageIdx) => {
          const realItems = page.filter(Boolean);
          const padCount = page.length - realItems.length;
          return (
            <div key={pageIdx} className="chorus-suggestion-list__page">
              <List
                variant="entry"
                size="xlarge"
                embedded
                items={realItems.map((item, rowIdx) => ({
                  value: item.value ?? `row-${pageIdx}-${rowIdx}`,
                  label: item.name,
                  secondary: item.followers,
                  description: item.description,
                  thumbnail: item.thumbnail ?? { alt: item.name },
                  trailingIcon: (
                    <Button variant="toggle" active={!!item.active} onClick={item.onToggle}>
                      {item.active ? followingLabel : followLabel}
                    </Button>
                  ),
                }))}
              />
              {padCount > 0
                ? Array.from({ length: padCount }).map((_, padIdx) => (
                    <div
                      key={`pad-${padIdx}`}
                      className="chorus-suggestion-list__row--pad"
                      aria-hidden="true"
                    />
                  ))
                : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
