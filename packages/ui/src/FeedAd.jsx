'use client';

import { useRef } from 'react';
import { Button } from './Button.jsx';
import { Byline } from './Byline.jsx';
import { joinClasses } from './spec-utils.js';
import { XIcon } from './icons/index.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* FeedAd — the `ad` sub-component of the Feed family. In-feed sponsored
   placement that rides the same column as the default Feed card. The
   brand row composes the shared Byline component (avatar + name +
   "Sponsored" subtitle + optional dismiss trailing). The schema spec
   (schema/components/feed/ad.md) is the source of truth for which
   slots are optional and how they collapse. */

function BrandRow({ brand, onDismiss, dismissLabel }) {
  /* Subtitle defaults to "Sponsored" — every FeedAd placement must read
     as sponsored content. Consumers may override but cannot drop it. */
  const subtitle = brand.subtitle ?? 'Sponsored';
  const trailing = onDismiss ? (
    <button
      type="button"
      className="chorus-feed-ad__dismiss"
      onClick={onDismiss}
      aria-label={dismissLabel ?? 'Dismiss ad'}
    >
      <XIcon size={16} />
    </button>
  ) : null;
  return (
    <Byline
      className="chorus-feed-ad__brand"
      avatar={brand.avatar ?? { alt: brand.name }}
      name={brand.name}
      subtitle={subtitle}
      trailing={trailing}
    />
  );
}

function Media({ src, alt }) {
  return (
    <div className="chorus-feed-ad__media">
      {src ? (
        <img src={src} alt={alt ?? ''} />
      ) : (
        <span className="chorus-feed-ad__media-fallback" aria-label={alt ?? ''} role="img" />
      )}
    </div>
  );
}

export function FeedAd({
  brand,
  onDismiss,
  dismissLabel,
  title,
  body,
  media,
  cta,
  className,
  ...rest
}) {
  /* `cta.color` plumbs an ad-client-supplied Hex through to the button
     surface. Only the fill and border swap; every other Standard Button
     token binding stays intact. */
  const ctaStyle = cta?.color ? { background: cta.color, borderColor: cta.color } : undefined;
  const ref = useRef(null);
  useFullBleedGuard(ref, 'FeedAd');

  return (
    <article ref={ref} className={joinClasses('chorus-feed-ad', className)} {...rest}>
      <BrandRow brand={brand} onDismiss={onDismiss} dismissLabel={dismissLabel} />

      {(title || body) ? (
        <div className="chorus-feed-ad__post-text">
          {title ? <h3 className="chorus-feed-ad__title">{title}</h3> : null}
          {body ? <p className="chorus-feed-ad__body">{body}</p> : null}
        </div>
      ) : null}

      {(media || cta) ? (
        /* Hero media + CTA share a single `radius.md` clip with no
           internal gap; the group's overflow:hidden makes the squared
           button corners merge into the hero's bottom edge. */
        <div className="chorus-feed-ad__cta-group">
          {media ? <Media {...media} /> : null}
          {cta ? (
            <Button
              appearance="primary"
              size="medium"
              fullWidth
              onClick={cta.onClick}
              className="chorus-feed-ad__cta"
              style={ctaStyle}
            >
              {cta.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
