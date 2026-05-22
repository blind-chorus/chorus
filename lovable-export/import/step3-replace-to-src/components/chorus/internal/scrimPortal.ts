// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
'use client';

import { useEffect, useState } from 'react';

/* Shared scrim-anchored-interruption hooks. Both Dialog and BottomSheet
   render into a portal at document.body, lock body scroll while open,
   and resolve their portal target on mount (so SSR doesn't reach for
   `document`). The behavior is identical, so it lives here instead of
   being copy-pasted in each component. */

export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [locked]);
}

export function usePortalTarget() {
  const [target, setTarget] = useState(null);
  useEffect(() => {
    setTarget(typeof document !== 'undefined' ? document.body : null);
  }, []);
  return target;
}
