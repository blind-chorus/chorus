'use client';

import { useState } from 'react';
import { joinClasses } from './spec-utils.js';
import { Badge } from './Badge.jsx';

/* Thumbnail — small-rung circular image. Pure visual primitive with two
   optional corner badges (updateDot top-right, logoBadge bottom-right).
   The schema spec (schema/components/thumbnail/thumbnail.md) is the
   source of truth for the size ladder and the dot-size break at the 32
   rung. The ladder is exposed as a numeric `size` prop so consumers can
   pass the raw pixel rung directly — there is no t-shirt naming because
   the design language already refers to "the 48 thumbnail", "the 24
   thumbnail" in product specs.

   The component never falls back to text — `image` is the only content
   slot. Consumers pass `src` (and `alt`); when the asset hasn't loaded
   the surface tone alone holds the row's rhythm.

   Load-failure handling: a CSS `background-image` placeholder is always
   painted on `.chorus-thumbnail__image`. When `<img>` is present, it
   overlays the placeholder. If the asset 404s or fails to decode, we
   drop the <img> from the tree so the background placeholder becomes
   visible — otherwise the browser paints its broken-image glyph on top
   and the slot looks worse than "no image at all". The failed-src
   bookkeeping is keyed by URL so a later prop change to a fresh src
   re-tries the load. */

const SIZES = [16, 20, 24, 32, 40, 48];

function normalizeSize(size) {
  return SIZES.includes(size) ? size : 48;
}

export function Thumbnail({
  size = 48,
  src,
  alt = '',
  updateDot = false,
  logoBadge,
  className,
  style,
  ...rest
}) {
  const px = normalizeSize(size);
  /* Update dot picks the matching Badge `dot-*` rung — `dot-md` (8×8)
     at the 32 / 40 / 48 rungs, `dot-sm` (6×6) below — so the corner
     flag, the rung name, and the Badge family stay in lockstep. */
  const dotSize = px >= 32 ? 'dot-md' : 'dot-sm';
  const [failedSrc, setFailedSrc] = useState(null);
  const [failedBadgeSrc, setFailedBadgeSrc] = useState(null);
  const imgSrc = src && src !== failedSrc ? src : null;
  const badgeSrc = logoBadge?.src && logoBadge.src !== failedBadgeSrc ? logoBadge.src : null;
  return (
    <span
      className={joinClasses('chorus-thumbnail', `chorus-thumbnail--${px}`, className)}
      style={{
        '--thumb-size': `${px}px`,
        ...style,
      }}
      {...rest}
    >
      <span className="chorus-thumbnail__image">
        {imgSrc ? <img src={imgSrc} alt={alt} onError={() => setFailedSrc(src)} /> : null}
      </span>
      {updateDot ? (
        <Badge size={dotSize} className="chorus-thumbnail__dot" />
      ) : null}
      {logoBadge ? (
        <span className="chorus-thumbnail__badge" aria-hidden="true">
          {badgeSrc ? <img src={badgeSrc} alt="" onError={() => setFailedBadgeSrc(logoBadge.src)} /> : null}
        </span>
      ) : null}
    </span>
  );
}
