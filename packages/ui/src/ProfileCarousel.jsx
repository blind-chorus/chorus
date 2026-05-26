'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './Button.jsx';
import { Thumbnail } from './Thumbnail.jsx';
import { joinClasses } from './spec-utils.js';
import { PulseFillIcon, StarFillIcon, ThumbUpFillIcon } from './icons/index.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* ProfileCarousel — horizontally-scrolling rail of profile-style cards
   (channels / user profiles / company channels). Sibling to PostCarousel:
   the pager geometry is identical, the card shape is different. Each
   card has a fixed 176px width and renders Toggle Button as the follow
   affordance. The section heading and the optional 'See all' link live
   on the Section wrapper. See
   schema/components/section/profile-carousel.md for the contract. */

const MAX_CARDS = 5;

const METRIC_KINDS = {
  star: { Icon: StarFillIcon, tone: 'var(--ref-palette-yellow-500)' },
  pulse: { Icon: PulseFillIcon, tone: 'var(--sys-color-success)' },
  thumb: { Icon: ThumbUpFillIcon, tone: 'var(--sys-color-primary)' },
};

// Universal Chorus image-area placeholder — shared across every empty
// image slot (Thumbnail, FeedAd media, ProfileCarousel cover). Consumers
// expose this file at `/placeholder.png` in their public/ directory.
const PLACEHOLDER_IMAGE = '/placeholder.png';

export function ProfileCarousel({
  items = [],
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const cards = items.slice(0, MAX_CARDS);
  const pagerRef = useRef(null);
  const cardRefs = useRef([]);
  const rootRef = useRef(null);
  useFullBleedGuard(rootRef, 'ProfileCarousel');
  const [activeIndex, setActiveIndex] = useState(0);

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
      ref={rootRef}
      className={joinClasses('chorus-profile-carousel', className)}
      aria-label={ariaLabel}
      {...rest}
    >
      <div
        ref={pagerRef}
        className="chorus-profile-carousel__pager"
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
        <div className="chorus-profile-carousel__pagination" aria-hidden="true">
          {cards.map((_, idx) => (
            <span
              key={idx}
              className={joinClasses(
                'chorus-profile-carousel__dot',
                idx === activeIndex && 'chorus-profile-carousel__dot--active',
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
    cover,
    name,
    followers,
    metrics = [],
    description,
    followed,
    onFollowChange,
    followLabel = 'Follow',
    followingLabel = 'Following',
    onClick,
  } = item;
  const hasDescription = typeof description === 'string' && description.length > 0;
  const Tag = onClick ? 'button' : 'article';
  const extraProps = onClick ? { type: 'button', onClick } : {};
  return (
    <Tag
      ref={innerRef}
      data-index={index}
      className={joinClasses(
        'chorus-profile-carousel__card',
        onClick && 'chorus-profile-carousel__card--clickable',
      )}
      {...extraProps}
    >
      <div className="chorus-profile-carousel__cover" aria-hidden="true">
        <img
          className="chorus-profile-carousel__cover-image"
          src={cover?.src ?? PLACEHOLDER_IMAGE}
          alt={cover?.alt ?? ''}
        />
      </div>

      <div className="chorus-profile-carousel__avatar-wrap">
        <Thumbnail size={64} {...(avatar ?? { alt: name })} />
      </div>

      <div className="chorus-profile-carousel__identity">
        <h4 className="chorus-profile-carousel__name">{name}</h4>
        <span className="chorus-profile-carousel__followers">{followers}</span>
      </div>

      {hasDescription ? (
        <div className="chorus-profile-carousel__description">
          <p className="chorus-profile-carousel__description-text">{description}</p>
        </div>
      ) : (
        <div className="chorus-profile-carousel__metrics" role="group" aria-label={`${name} metrics`}>
          {metrics.map((metric, i) => {
            const kind = typeof metric.icon === 'string' ? METRIC_KINDS[metric.icon] : null;
            const Icon = kind?.Icon;
            return (
              <span key={i} className="chorus-profile-carousel__metric">
                <span
                  className="chorus-profile-carousel__metric-icon"
                  style={{ color: metric.color ?? kind?.tone }}
                  aria-hidden="true"
                >
                  {Icon ? <Icon /> : metric.icon}
                </span>
                <span className="chorus-profile-carousel__metric-value">{metric.value}</span>
              </span>
            );
          })}
        </div>
      )}

      <div className="chorus-profile-carousel__action">
        <Button
          variant="toggle"
          active={!!followed}
          onClick={(e) => {
            e.stopPropagation();
            onFollowChange?.(!followed);
          }}
        >
          {followed ? followingLabel : followLabel}
        </Button>
      </div>
    </Tag>
  );
}
