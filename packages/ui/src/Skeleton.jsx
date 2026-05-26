'use client';

import { joinClasses } from './spec-utils.js';

/* Skeleton — placeholder shape that previews where real content will
   render. A single tonal block on `surfaceContainerHighest` with a
   slow opacity pulse. Three shapes: `text` (default, 16px-line block),
   `block` (rectangular, taller fill — image / card body), `circle`
   (Thumbnail-equivalent avatar placeholder). Consumer-supplied width /
   height override the default footprint. `layoutInset="inline"` — the
   placeholder sits as a leaf inside whichever surface it stands in
   for; no full-bleed gutter responsibility. See schema/components/
   skeleton/skeleton.md. */

export function Skeleton({
  shape = 'text',
  width,
  height,
  className,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={ariaLabel ?? 'Loading'}
      className={joinClasses(
        'chorus-skeleton',
        `chorus-skeleton--${shape}`,
        className,
      )}
      style={{
        ...(width != null ? { width: typeof width === 'number' ? `${width}px` : width } : null),
        ...(height != null ? { height: typeof height === 'number' ? `${height}px` : height } : null),
        ...style,
      }}
      {...rest}
    />
  );
}

/* SkeletonGroup — vertical stack of Skeletons that mirrors the rhythm
   of the content it replaces. Owns no chrome of its own; only enforces
   `sys.layout.stack.xs` (8px) between children so a multi-line text
   placeholder reads as one block. */
export function SkeletonGroup({
  className,
  children,
  'aria-label': ariaLabel,
  ...rest
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel ?? 'Loading'}
      className={joinClasses('chorus-skeleton-group', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
