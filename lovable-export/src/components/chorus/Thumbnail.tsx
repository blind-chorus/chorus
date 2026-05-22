// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
import { joinClasses } from './spec-utils';
import { Badge } from './Badge';

/** Props for Thumbnail. Generated from schema/components/thumbnail/thumbnail.spec.json — edit there, then re-run `npm run build:lovable`. */
export interface ThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 48 | 40 | 32 | 24 | 20 | 16;
  /** URL of the image asset that fills the circular slot — a raster (PNG / JPG / WebP) or vector (SVG) source. Required for the rendered form; the prop is technically optional because the Thumbnail also has a defined `surfaceContainerHigh` fallback, but any production composition is expected to pass a real asset. When generating mock or scaffold compositions without a real channel / author image, use the bundled placeholder asset at `/placeholder_thumbnail.png` rather than omitting `src` — the empty-surface fallback is for runtime load failures, not for design-time scaffolding. */
  src?: string;
  alt: string;
  updateDot?: boolean;
  /** { src, alt } — 16×16 circular badge at the bottom-right. */
  logoBadge?: Record<string, any>;
}

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
   the surface tone alone holds the row's rhythm. */

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
}: ThumbnailProps) {
  const px = normalizeSize(size);
  /* Update dot picks the matching Badge `dot-*` rung — `dot-md` (8×8)
     at the 32 / 40 / 48 rungs, `dot-sm` (6×6) below — so the corner
     flag, the rung name, and the Badge family stay in lockstep. */
  const dotSize = px >= 32 ? 'dot-md' : 'dot-sm';
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
        {src ? <img src={src} alt={alt} /> : null}
      </span>
      {updateDot ? (
        <Badge size={dotSize} className="chorus-thumbnail__dot" />
      ) : null}
      {logoBadge ? (
        <span className="chorus-thumbnail__badge" aria-hidden="true">
          {logoBadge.src ? <img src={logoBadge.src} alt="" /> : null}
        </span>
      ) : null}
    </span>
  );
}
