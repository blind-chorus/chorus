'use client';

import { useRef } from 'react';
import spec from '../../../../schema/components/tabs/segmented.spec.json';
import { useScrollOverflow } from './useScrollOverflow.js';
import { tokenToCss, joinClasses } from '../spec-utils.js';

/* Segmented Tabs container. Visual chrome of the segments themselves is
   delegated to Filter chip (see `Tab.jsx` — segmented variant renders
   with `chorus-chip chorus-chip--filter` classes). This container only
   provides the row-level layout: transparent background, horizontal
   padding, fixed inter-segment gap, and `overflow-x: auto` so a row
   that exceeds its surrounding column scrolls instead of compressing
   the segments.

   Carries the Edge fade affordance via `useScrollOverflow`, which
   toggles `data-overflow-end` whenever the row's scroll width exceeds
   its visible width — the mask rule in styles.css keys off that
   attribute. */
export function TabsSegmented({ className, style, children, ...rest }) {
  const ref = useRef(null);
  useScrollOverflow(ref);
  const s = spec.sizing;
  const composedStyle = {
    '--tabs-container-padding-block': tokenToCss(s.containerPaddingBlock),
    '--tabs-container-padding-inline': tokenToCss(s.containerPaddingInline),
    '--tabs-inter-segment-gap': tokenToCss(s.interSegmentGap),
    '--tabs-fade-width': tokenToCss(s.fadeWidth),
    ...style,
  };
  return (
    <div
      ref={ref}
      className={joinClasses('chorus-tabs', 'chorus-tabs--segmented', className)}
      style={composedStyle}
      {...rest}
    >
      {children}
    </div>
  );
}
