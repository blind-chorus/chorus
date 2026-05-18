import { joinClasses } from './spec-utils.js';

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
}) {
  const px = normalizeSize(size);
  const dotPx = px >= 32 ? 8 : 4;
  return (
    <span
      className={joinClasses('chorus-thumbnail', `chorus-thumbnail--${px}`, className)}
      style={{
        '--thumb-size': `${px}px`,
        '--thumb-dot-size': `${dotPx}px`,
        ...style,
      }}
      {...rest}
    >
      <span className="chorus-thumbnail__image">
        {src ? <img src={src} alt={alt} /> : null}
      </span>
      {updateDot ? (
        <span className="chorus-thumbnail__dot" aria-hidden="true" />
      ) : null}
      {logoBadge ? (
        <span className="chorus-thumbnail__badge" aria-hidden="true">
          {logoBadge.src ? <img src={logoBadge.src} alt="" /> : null}
        </span>
      ) : null}
    </span>
  );
}
