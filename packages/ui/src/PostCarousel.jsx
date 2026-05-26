'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './Button.jsx';
import { Thumbnail } from './Thumbnail.jsx';
import { joinClasses } from './spec-utils.js';
import { VerifiedFillIcon, EyeIcon } from './icons/index.js';

/* PostCarousel — the `carousel` sub-component of the Feed family. A
   horizontally-scrolling pager of up to 5 compact post cards. The
   schema spec (schema/components/feed/carousel.md) is the source of
   truth for the 5-card hard cap and the next-card peek geometry.

   PostCarousel is the *content* — the section heading + trailing
   `See all` link live on the [Section](../section/section.md) wrapper,
   not here. Compose `<Section label="…"><PostCarousel items={…} /></Section>`. */

const MAX_CARDS = 5;

export function PostCarousel({
  items = [],
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  /* Hard cap — editorial / ops mistakes never blow out the section. */
  const cards = items.slice(0, MAX_CARDS);
  const pagerRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Pagination dots are decorative; the active dot reflects the current
     snap target. IntersectionObserver fires when a card crosses ~60% of
     the pager viewport, so the dot snaps in lockstep with the swipe. */
  useEffect(() => {
    const pager = pagerRef.current;
    if (!pager || cards.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number(entry.target.dataset.index);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { root: pager, threshold: [0.6] },
    );
    for (const node of cardRefs.current) {
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [cards.length]);

  return (
    <div
      className={joinClasses('chorus-post-carousel', className)}
      aria-label={ariaLabel}
      {...rest}
    >
      <div
        ref={pagerRef}
        className="chorus-post-carousel__pager"
        role="group"
        aria-label="Carousel cards"
      >
        {cards.map((item, idx) => (
          <Card
            key={item.id ?? idx}
            item={item}
            innerRef={(node) => { cardRefs.current[idx] = node; }}
            index={idx}
          />
        ))}
      </div>

      {cards.length > 1 ? (
        <div className="chorus-post-carousel__pagination" aria-hidden="true">
          {cards.map((_, idx) => (
            <span
              key={idx}
              className={joinClasses(
                'chorus-post-carousel__dot',
                idx === activeIndex && 'chorus-post-carousel__dot--active',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Card({ item, innerRef, index }) {
  const {
    avatar,
    channel,
    verified,
    followAction,
    followed,
    onFollowChange,
    title,
    body,
    mention,
    views,
    moreLabel,
    onClick,
  } = item;
  const Tag = onClick ? 'button' : 'article';
  const extraProps = onClick ? { type: 'button', onClick } : {};
  return (
    <Tag
      ref={innerRef}
      data-index={index}
      className={joinClasses(
        'chorus-post-carousel__card',
        onClick && 'chorus-post-carousel__card--clickable',
      )}
      {...extraProps}
    >
      <header className="chorus-post-carousel__card-header">
        <Thumbnail size={40} {...(avatar ?? { alt: channel })} />
        <span className="chorus-post-carousel__card-channel-row">
          {verified ? (
            <span className="chorus-post-carousel__card-verified" aria-label="Verified">
              <VerifiedFillIcon />
            </span>
          ) : null}
          <span className="chorus-post-carousel__card-channel">{channel}</span>
        </span>
        {followAction ? (
          <Button
            variant="text"
            size="xsmall"
            appearance={followed ? 'default' : 'accent'}
            className="chorus-post-carousel__card-follow"
            aria-pressed={!!followed}
            onClick={(e) => {
              e.stopPropagation();
              onFollowChange?.(!followed);
            }}
          >
            {followed ? 'Following' : 'Follow'}
          </Button>
        ) : null}
      </header>

      <div className="chorus-post-carousel__card-body">
        <h4 className="chorus-post-carousel__card-title">{title}</h4>
        <p className="chorus-post-carousel__card-text">{body}</p>
        {mention ? (
          <span className="chorus-post-carousel__card-mention">{mention}</span>
        ) : null}
      </div>

      <footer className="chorus-post-carousel__card-footer">
        <Button
          variant="text"
          size="xsmall"
          appearance="secondary"
          className="chorus-post-carousel__card-more"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
          {moreLabel ?? 'See more'}
        </Button>
        <span className="chorus-post-carousel__card-views" role="status" aria-label={`Views — ${views}`}>
          <EyeIcon />
          <span>{views}</span>
        </span>
      </footer>
    </Tag>
  );
}
