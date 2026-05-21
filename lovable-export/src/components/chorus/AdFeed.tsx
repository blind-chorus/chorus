// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
'use client';

import { Button } from './Button';
import { Thumbnail } from './Thumbnail';
import { joinClasses } from './spec-utils';
import { CloseIcon } from './icons/index';

/* AdFeed — in-feed sponsored placement. Composes a brand row (avatar +
   name + optional subtitle + optional dismiss), an optional title/body
   block, a hero media block, and a single full-width Standard Button.
   The schema spec (schema/components/ad-feed/ad-feed.md) is the source of
   truth for which slots are optional and how they collapse. */

function BrandRow({ brand, onDismiss, dismissLabel }) {
  return (
    <header className="chorus-ad-feed__brand">
      <Thumbnail size={32} {...(brand.avatar ?? { alt: brand.name })} />
      <div className="chorus-ad-feed__brand-text">
        <span className="chorus-ad-feed__brand-name">{brand.name}</span>
        {brand.subtitle ? (
          <span className="chorus-ad-feed__brand-subtitle">{brand.subtitle}</span>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="chorus-ad-feed__dismiss"
          onClick={onDismiss}
          aria-label={dismissLabel ?? 'Dismiss ad'}
        >
          <CloseIcon size={16} />
        </button>
      ) : null}
    </header>
  );
}

function Media({ src, alt, background }) {
  const style = background ? { background } : undefined;
  return (
    <div className="chorus-ad-feed__media" style={style}>
      {src ? (
        <img src={src} alt={alt ?? ''} />
      ) : (
        <span className="chorus-ad-feed__media-fallback" aria-label={alt ?? ''} role="img" />
      )}
    </div>
  );
}

export function AdFeed({
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
  return (
    <article className={joinClasses('chorus-ad-feed', className)} {...rest}>
      <BrandRow brand={brand} onDismiss={onDismiss} dismissLabel={dismissLabel} />

      {(title || body) ? (
        <div className="chorus-ad-feed__post-text">
          {title ? <h3 className="chorus-ad-feed__title">{title}</h3> : null}
          {body ? <p className="chorus-ad-feed__body">{body}</p> : null}
        </div>
      ) : null}

      {media ? <Media {...media} /> : null}

      {cta ? (
        <Button
          appearance={cta.appearance ?? 'primary'}
          size={cta.size ?? 'medium'}
          fullWidth
          onClick={cta.onClick}
        >
          {cta.label}
        </Button>
      ) : null}
    </article>
  );
}
