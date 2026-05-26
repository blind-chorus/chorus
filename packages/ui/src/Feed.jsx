'use client';

import { useState } from 'react';
import { Button } from './Button.jsx';
import { Thumbnail } from './Thumbnail.jsx';
import { joinClasses } from './spec-utils.js';
import {
  CompensationFillIcon,
  HeartFillIcon,
  HeartIcon,
  SquareStackIcon,
  PollFillIcon,
  ReplyIcon,
  EyeIcon,
} from './icons/index.js';

/* Feed — a vertically-stacked content card. The Feed primitive is pure
   composition: it owns the slot order and the surface chrome, but every
   sub-affordance (Follow toggle, citation link, engagement counters)
   threads through props rather than children, so consumers data-bind to a
   single object instead of assembling JSX. The schema spec
   (schema/components/feed/feed.md) is the source of truth for which slots
   are optional and how they collapse — this component implements those
   rules. */

function CoverThumbnail({ alt, src, stacked }) {
  return (
    <div className="chorus-feed__thumbnail">
      {src ? (
        <img src={src} alt={alt ?? ''} />
      ) : (
        <span className="chorus-feed__thumbnail-fallback" aria-label={alt ?? ''} role="img" />
      )}
      {stacked ? (
        <span className="chorus-feed__thumbnail-stack" aria-label="Multiple images" role="img">
          <SquareStackIcon size={16} />
        </span>
      ) : null}
    </div>
  );
}

/* TagBanner renders both the poll module and the offer-evaluation module.
   The two share the same chrome (surfaceVariant slab, leading icon + label
   on the editorial tone, divider, trailing participant count) and differ
   only on glyph + tone. The label string is constrained by the spec to
   "Poll" or "Offer" — those are the two editorial categories the banner
   surfaces. Consumers should not pass a free-form label. */
function TagBanner({ kind, label, participants }) {
  const Icon = kind === 'offer' ? CompensationFillIcon : PollFillIcon;
  const resolvedLabel = label ?? (kind === 'offer' ? 'Offer' : 'Poll');
  return (
    <div
      className={joinClasses('chorus-feed__poll', kind === 'offer' && 'chorus-feed__poll--offer')}
      role="group"
    >
      <span className="chorus-feed__poll-title">
        <span className="chorus-feed__poll-glyph"><Icon /></span>
        <span className="chorus-feed__poll-label">{resolvedLabel}</span>
      </span>
      <span className="chorus-feed__poll-divider" aria-hidden="true" />
      <span className="chorus-feed__poll-participants">
        <strong>{participants}</strong> Participants
      </span>
    </div>
  );
}

function CitationCard({ title, source, sourceIcon, hero }) {
  return (
    <a className="chorus-feed__citation" href="#" onClick={(e) => e.preventDefault()}>
      <span className="chorus-feed__citation-hero" role="img" aria-label={hero?.alt ?? ''}>
        {hero?.src ? <img src={hero.src} alt="" /> : null}
      </span>
      <span className="chorus-feed__citation-body">
        <span className="chorus-feed__citation-title">{title}</span>
        <span className="chorus-feed__citation-source">
          <span className="chorus-feed__citation-source-icon" aria-hidden="true">
            {sourceIcon ?? null}
          </span>
          <span className="chorus-feed__citation-source-name">{source}</span>
        </span>
      </span>
    </a>
  );
}

/* Engagement footer — three counters laid out as an `xsmall` Text
   Button group (4px gap, per the Text Button group rule for the
   24-tall rung). Likes and Comments are real Text Buttons; Views
   renders as a non-interactive `<span>` styled to match the same
   rhythm, so the row reads as one visual unit even though only the
   first two affordances commit. The Like button toggles between an
   `onSurfaceVariant` outline rest state (`HeartIcon`, `secondary`
   appearance) and a brand-filled state (`HeartFillIcon`, secondary
   appearance + `--button-text-label` override to `sys.color.brand`)
   with the count incrementing in lockstep. Pattern mirrors
   `followAction`: pass `liked` + `onLikeChange` for controlled
   state, or omit both for an uncontrolled fallback (the previews
   and docs Stage use the uncontrolled path so the demo is tappable
   without wiring). */
function Engagement({ likes, comments, views, liked, onLikeChange }) {
  const isControlled = liked !== undefined;
  const [uLiked, setULiked] = useState(false);
  const [delta, setDelta] = useState(0);
  const active = isControlled ? liked : uLiked;
  const count = (likes ?? 0) + (isControlled ? 0 : delta);

  const handleLike = () => {
    if (isControlled) {
      onLikeChange?.(!liked);
      return;
    }
    setULiked((prev) => {
      const next = !prev;
      setDelta((d) => d + (next ? 1 : -1));
      return next;
    });
  };

  return (
    <div className="chorus-feed__engagement" role="group">
      <Button
        variant="text"
        size="xsmall"
        appearance="secondary"
        className={joinClasses('chorus-feed__like', active && 'chorus-feed__like--active')}
        leadingIcon={active ? <HeartFillIcon /> : <HeartIcon />}
        aria-pressed={active}
        aria-label={`Like — ${count}`}
        onClick={handleLike}
      >
        {count}
      </Button>
      <Button
        variant="text"
        size="xsmall"
        appearance="secondary"
        leadingIcon={<ReplyIcon />}
        aria-label={`Comments — ${comments}`}
      >
        {comments}
      </Button>
      {/* Views — display only. Same `xsmall`/16-glyph/12-label rhythm
          as the Text Buttons next to it, but renders as a `<span>` so
          there is no hover / focus / pressed treatment — `aria-disabled`
          is the wrong shape because views isn't an action that has been
          turned off; it simply isn't an action. */}
      <span className="chorus-feed__views" role="status" aria-label={`Views — ${views}`}>
        <span className="chorus-feed__views-icon" aria-hidden="true"><EyeIcon /></span>
        <span>{views}</span>
      </span>
    </div>
  );
}

export function Feed({
  flag,
  avatar,
  channel,
  channelHref = '#',
  timestamp,
  followAction = false,
  followed = false,
  onFollowChange,
  meta,
  title,
  body,
  thumbnail,
  poll,
  offer,
  citation,
  mention,
  engagement,
  className,
  ...rest
}) {
  return (
    <article className={joinClasses('chorus-feed', className)} {...rest}>
      {flag ? <div className="chorus-feed__flag">{flag}</div> : null}

      <header className="chorus-feed__header">
        <Thumbnail size={32} {...(avatar ?? { alt: channel })} />
        <div className="chorus-feed__header-text">
          <div className="chorus-feed__channel-row">
            <a
              className="chorus-feed__channel"
              href={channelHref}
              onClick={channelHref === '#' ? (e) => e.preventDefault() : undefined}
            >
              {channel}
            </a>
            {timestamp ? (
              <span className="chorus-feed__timestamp">{timestamp}</span>
            ) : null}
            {followAction ? (
              <>
                <span className="chorus-feed__dot" aria-hidden="true">·</span>
                <button
                  type="button"
                  className="chorus-feed__follow"
                  aria-pressed={followed}
                  onClick={() => onFollowChange?.(!followed)}
                >
                  {followed ? 'Following' : 'Follow'}
                </button>
              </>
            ) : null}
          </div>
          {meta?.length ? (
            <div className="chorus-feed__meta">
              {meta.map((part, i) => {
                /* Each meta item is its own link by contract — strings
                   render against a stub `#` href so the demo is clickable
                   without wiring; consumers route by passing
                   `{ label, href }`. The separator sits between siblings,
                   not inside the link itself, so the underline does not
                   span the middot. */
                const isObj = part && typeof part === 'object' && 'label' in part;
                const label = isObj ? part.label : part;
                const href = isObj ? part.href ?? '#' : '#';
                return (
                  <span key={i} className="chorus-feed__meta-part">
                    {i > 0 ? <span className="chorus-feed__meta-sep" aria-hidden="true">·</span> : null}
                    <a
                      className="chorus-feed__meta-link"
                      href={href}
                      onClick={href === '#' ? (e) => e.preventDefault() : undefined}
                    >
                      {label}
                    </a>
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      </header>

      {(title || body || thumbnail) ? (
        <div className="chorus-feed__post">
          <div className="chorus-feed__post-text">
            {title ? <h3 className="chorus-feed__title">{title}</h3> : null}
            {body ? <p className="chorus-feed__body">{body}</p> : null}
          </div>
          {thumbnail ? <CoverThumbnail {...thumbnail} /> : null}
        </div>
      ) : null}

      {poll ? <TagBanner kind="poll" {...poll} /> : null}
      {offer ? <TagBanner kind="offer" {...offer} /> : null}
      {citation ? <CitationCard {...citation} /> : null}

      {mention ? (
        <a className="chorus-feed__mention" href="#" onClick={(e) => e.preventDefault()}>
          {mention}
        </a>
      ) : null}

      {engagement ? <Engagement {...engagement} /> : null}
    </article>
  );
}

/* FeedGroup — semantic wrapper that bundles consecutive Feed Posts
   (canonical case: 3 stacked) into one thread-grouped or topic-bundled
   sub-stream. The group adds no surface chrome — each inner Post keeps
   its own padding + hairline bottom divider — so the bundle reads as a
   continuous slice of the stream while the wrapper carries intent via
   role="region" + an optional aria-label. */
export function FeedGroup({ label, className, children, ...rest }) {
  return (
    <section
      className={joinClasses('chorus-feed-group', className)}
      role="region"
      aria-label={label}
      {...rest}
    >
      {children}
    </section>
  );
}
