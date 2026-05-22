// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
'use client';

import { Button } from './Button';
import { Thumbnail } from './Thumbnail';
import { joinClasses } from './spec-utils';
import { CloseIcon } from './icons/index';

/* FeedAd — the `ad` sub-component of the Feed family. In-feed sponsored
   placement that rides the same column as the default Feed card. The
   schema spec (schema/components/feed/ad.md) is the source of truth for
   which slots are optional and how they collapse. */

function BrandRow({ brand, onDismiss, dismissLabel }) {
  /* Subtitle defaults to "Sponsored" — every FeedAd placement must read
     as sponsored content. Consumers may override but cannot drop it. */
  const subtitle = brand.subtitle ?? 'Sponsored';
  return (
    <header className="chorus-feed-ad__brand">
      <Thumbnail size={32} {...(brand.avatar ?? { alt: brand.name })} />
      <div className="chorus-feed-ad__brand-text">
        <span className="chorus-feed-ad__brand-name">{brand.name}</span>
        <span className="chorus-feed-ad__brand-subtitle">{subtitle}</span>
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="chorus-feed-ad__dismiss"
          onClick={onDismiss}
          aria-label={dismissLabel ?? 'Dismiss ad'}
        >
          <CloseIcon size={16} />
        </button>
      ) : null}
    </header>
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

  return (
    <article className={joinClasses('chorus-feed-ad', className)} {...rest}>
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
