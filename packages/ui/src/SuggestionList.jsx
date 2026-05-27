'use client';

import { useRef } from 'react';
import { Thumbnail } from './Thumbnail.jsx';
import { Button } from './Button.jsx';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* SuggestionList — a vertically-stacked block of follow suggestions
   rendered as a swipeable pager. Each page shows exactly three rows
   (Thumbnail 48 + name / followers / description + a Toggle Button on
   the trailing edge); the next page peeks at the trailing side of the
   viewport to invite the horizontal swipe. Anatomy is entity-agnostic —
   suggested channels, people, companies, topics all share the same shape.

   The component is presentation-only for the row body — tapping the
   avatar / text column does not route. The only commit affordance per
   row is the trailing Toggle Button, whose `active` state is owned by
   the consumer (forwarded through each item's `active` + `onToggle`).
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
        {pages.map((page, pageIdx) => (
          <div key={pageIdx} className="chorus-suggestion-list__page">
            {page.map((item, rowIdx) =>
              item ? (
                <Row
                  key={item.value ?? rowIdx}
                  item={item}
                  followLabel={followLabel}
                  followingLabel={followingLabel}
                />
              ) : (
                <div key={`pad-${rowIdx}`} className="chorus-suggestion-list__row chorus-suggestion-list__row--pad" aria-hidden="true" />
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Row({ item, followLabel, followingLabel }) {
  const { name, followers, description, active, onToggle, thumbnail } = item;
  return (
    <div className="chorus-suggestion-list__row">
      <span className="chorus-suggestion-list__avatar">
        <Thumbnail size={48} {...(thumbnail ?? { alt: name })} />
      </span>
      <span className="chorus-suggestion-list__text">
        <span className="chorus-suggestion-list__name">{name}</span>
        {followers ? <span className="chorus-suggestion-list__followers">{followers}</span> : null}
        {description ? <span className="chorus-suggestion-list__description">{description}</span> : null}
      </span>
      <span className="chorus-suggestion-list__action">
        <Button
          variant="toggle"
          active={!!active}
          onClick={onToggle}
        >
          {active ? followingLabel : followLabel}
        </Button>
      </span>
    </div>
  );
}
