'use client';

import { Thumbnail } from './Thumbnail.jsx';
import { joinClasses } from './spec-utils.js';

/* Metadata — standalone family (renamed from Byline; previously lived
   as Row family's metadata sub). Author / brand attribution cluster
   used by Feed Post and Feed Ad. Renders a 32-rung Thumbnail, a
   primary text line (entity name + optional inline timestamp +
   optional follow toggle), and an optional secondary line (`subtitle`
   plain text OR `meta` link row). Optional trailing slot hosts an
   action like the Feed Ad dismiss button.

   The middot separator's CSS sets `line-height: 1` so its line-box
   equals its font-size — keeps the row's text-line tight even when
   the inherited line-height would otherwise allow extra space around
   the bullet glyph.

   See schema/components/metadata/metadata.md. */

export function Metadata({
  avatar,
  name,
  nameHref,
  timestamp,
  followAction = false,
  followed = false,
  onFollowChange,
  subtitle,
  meta,
  trailing,
  className,
  ...rest
}) {
  const hasMeta = Array.isArray(meta) && meta.length > 0;
  const hasSubtitle = !hasMeta && subtitle != null && subtitle !== '';

  return (
    <div className={joinClasses('chorus-metadata', className)} {...rest}>
      <Thumbnail size={32} {...(avatar ?? { alt: typeof name === 'string' ? name : '' })} />
      <div className="chorus-metadata__text">
        <div className="chorus-metadata__primary">
          {nameHref ? (
            <a
              className="chorus-metadata__name"
              href={nameHref}
              onClick={nameHref === '#' ? (e) => e.preventDefault() : undefined}
            >
              {name}
            </a>
          ) : (
            <span className="chorus-metadata__name">{name}</span>
          )}
          {timestamp ? (
            <span className="chorus-metadata__timestamp">{timestamp}</span>
          ) : null}
          {followAction ? (
            <>
              <span className="chorus-metadata__dot" aria-hidden="true">·</span>
              <button
                type="button"
                className="chorus-metadata__follow"
                aria-pressed={followed ? 'true' : 'false'}
                onClick={() => onFollowChange?.(!followed)}
              >
                {followed ? 'Following' : 'Follow'}
              </button>
            </>
          ) : null}
        </div>
        {hasMeta ? (
          <div className="chorus-metadata__meta">
            {meta.map((part, i) => {
              const isObj = part && typeof part === 'object' && 'label' in part;
              const label = isObj ? part.label : part;
              const href = isObj ? part.href ?? '#' : '#';
              return (
                <span key={i} className="chorus-metadata__meta-part">
                  {i > 0 ? <span className="chorus-metadata__dot" aria-hidden="true">·</span> : null}
                  <a
                    className="chorus-metadata__meta-link"
                    href={href}
                    onClick={href === '#' ? (e) => e.preventDefault() : undefined}
                  >
                    {label}
                  </a>
                </span>
              );
            })}
          </div>
        ) : hasSubtitle ? (
          <span className="chorus-metadata__subtitle">{subtitle}</span>
        ) : null}
      </div>
      {trailing ? (
        <div
          className="chorus-metadata__trailing"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {trailing}
        </div>
      ) : null}
    </div>
  );
}
