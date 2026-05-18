'use client';

import { useLayoutEffect, useRef } from 'react';
import spec from '../../../../schema/components/tabs/underline.spec.json';
import { useTabsContext } from './TabsContext.js';
import { useScrollOverflow } from './useScrollOverflow.js';
import { tokenToCss, typoStyles, joinClasses } from '../spec-utils.js';

/* Drive the single sliding indicator element. The indicator is a
   `position: absolute` span pinned to the bottom of the tab row; its
   `transform` (left offset) and `width` are updated to match the
   currently-selected tab's `offsetLeft` / `offsetWidth`. CSS handles
   the easing — selection change becomes a slide, not a snap.

   On the very first measurement we suppress the transition so the
   indicator doesn't fly in from `{0, 0}` to its initial position; once
   placed, transitions are re-enabled for subsequent value changes.
   ResizeObserver covers layout shifts (font load, container resize,
   sibling re-flow) so the indicator stays aligned without a controlled
   trigger. */
function useSlidingIndicator(containerRef, indicatorRef, value) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return undefined;

    let firstPlacement = !indicator.dataset.placed;
    const place = () => {
      const selected = container.querySelector('.chorus-tab--underline.is-selected');
      if (!selected) {
        indicator.style.opacity = '0';
        return;
      }
      if (firstPlacement) indicator.style.transition = 'none';
      indicator.style.transform = `translateX(${selected.offsetLeft}px)`;
      indicator.style.width = `${selected.offsetWidth}px`;
      indicator.style.opacity = '1';
      if (firstPlacement) {
        // Force a reflow then re-enable the transition so subsequent
        // value changes animate.
        void indicator.offsetWidth;
        indicator.style.transition = '';
        indicator.dataset.placed = 'true';
        firstPlacement = false;
      }
    };

    place();
    /* Re-place on container resize (layout reflow, font load, viewport
       change). We avoid observing individual tabs because their box
       changes during transitions and would re-fire `place()` mid-slide,
       restarting the transition from time 0 on every frame. */
    const ro = new ResizeObserver(place);
    ro.observe(container);
    return () => ro.disconnect();
  }, [containerRef, indicatorRef, value]);
}

/* Adaptive width — Underline has one width mode that resolves to one of
   two terminal layouts on every layout pass:

     • Fit    — Σ(tab.intrinsicWidth) ≤ container.clientWidth.
                Tabs stretch (`flex: 1 1 0`); row overflow: visible.
     • Scroll — Σ(tab.intrinsicWidth) >  container.clientWidth.
                Tabs hold content width (`flex: 0 0 auto`); row scrolls.

   We measure by temporarily resetting `data-fit` to the intrinsic
   ("scroll") layout — that's the layout where each tab's box equals its
   content — read the row's `scrollWidth`, compare to `clientWidth`, and
   commit Fit or Scroll. The reset/measure/commit happens inside one
   `useLayoutEffect` tick, so the browser never paints the intermediate
   state. A `ResizeObserver` on the row covers container width changes
   (a window resize, a parent column resizing); a `MutationObserver` on
   the row's child list covers tab add/remove. */
function useAdaptiveFit(containerRef) {
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const measure = () => {
      const prev = el.dataset.fit;
      el.dataset.fit = 'scroll';
      // Read after the reset so scrollWidth reflects the intrinsic sum.
      const fits = el.scrollWidth <= el.clientWidth + 1;
      const next = fits ? 'stretch' : 'scroll';
      if (next !== prev) el.dataset.fit = next;
      else el.dataset.fit = prev;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const mo = new MutationObserver(measure);
    mo.observe(el, { childList: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [containerRef]);
}

export function TabsUnderline({ className, style, children, ...rest }) {
  const ref = useRef(null);
  const indicatorRef = useRef(null);
  const { value } = useTabsContext();
  useAdaptiveFit(ref);
  useScrollOverflow(ref);
  useSlidingIndicator(ref, indicatorRef, value);

  const s = spec.sizing;
  const composedStyle = {
    '--tabs-container-padding-inline': tokenToCss(s.containerPaddingInline),
    '--tabs-tab-min-height': tokenToCss(s.minHeight),
    '--tabs-tab-padding-block': tokenToCss(s.paddingBlock),
    '--tabs-tab-padding-inline': tokenToCss(s.paddingInline),
    '--tabs-inter-tab-gap': tokenToCss(s.interTabGap),
    '--tabs-slot-gap': tokenToCss(s.slotGap),
    '--tabs-icon-size': tokenToCss(s.iconSize),
    '--tabs-indicator-height': tokenToCss(s.indicatorHeight),
    '--tabs-divider-width': tokenToCss(s.dividerWidth),
    '--tabs-divider-color': tokenToCss(s.dividerColor),
    '--tabs-fade-width': tokenToCss(s.fadeWidth),
    '--tabs-label-unselected': tokenToCss(spec.selectionStates.unselected.label),
    '--tabs-label-selected': tokenToCss(spec.selectionStates.selected.label),
    '--tabs-indicator-color': tokenToCss(spec.selectionStates.selected.indicator),
    '--tabs-overlay-hover': tokenToCss(spec.states.hovered.overlay.opacity),
    '--tabs-overlay-pressed': tokenToCss(spec.states.pressed.overlay.opacity),
    '--tabs-overlay-focus': tokenToCss(spec.focusIndicator.overlay.opacity),
    '--tabs-disabled-opacity': tokenToCss(spec.states.disabled.containerOpacity),
    '--tabs-focus-outer-width': tokenToCss(spec.focusIndicator.ring.outerWidth),
    '--tabs-focus-outer-color': tokenToCss(spec.focusIndicator.ring.outerColor),
    '--tabs-focus-inset-width': tokenToCss(spec.focusIndicator.ring.insetWidth),
    '--tabs-focus-inset-color': tokenToCss(spec.focusIndicator.ring.insetColor),
    ...typoStyles(s.labelTypo),
    ...style,
  };
  return (
    <div
      ref={ref}
      data-fit="scroll"
      className={joinClasses('chorus-tabs', 'chorus-tabs--underline', className)}
      style={composedStyle}
      {...rest}
    >
      {children}
      <span ref={indicatorRef} className="chorus-tabs__indicator" aria-hidden="true" />
    </div>
  );
}
