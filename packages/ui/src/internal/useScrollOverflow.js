import { useEffect } from 'react';

/* useScrollOverflow — toggles `data-overflow-start` / `data-overflow-end`
   on a horizontally-scrolling element so CSS can paint the Edge fade
   affordance only when there's hidden content past the visible edge.

   Both attributes resolve to `"true"` / `"false"` strings so the CSS
   selector reads naturally: `[data-overflow-end="true"]`. The end flag
   means "more content lies past the right edge" — paint the trailing
   fade. The start flag means "the visitor has scrolled past the
   leading edge" — used by future leading-edge fades, currently unused
   by any variant.

   Re-measures on user scroll (passive listener) and on container
   resize (ResizeObserver, covers font load, viewport change, and
   surrounding layout reflow). Shared across the three Tabs variants
   and ChannelRail-style horizontal rows. */
export function useScrollOverflow(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const canEnd = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      const canStart = el.scrollLeft > 0;
      el.dataset.overflowEnd = canEnd ? 'true' : 'false';
      el.dataset.overflowStart = canStart ? 'true' : 'false';
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [ref]);
}
