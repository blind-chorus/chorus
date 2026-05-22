// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.
'use client';

import { useRef } from 'react';
import spec from '../specs/tabs/rounded.spec.json';
import { useScrollOverflow } from './useScrollOverflow';
import { tokenToCss, joinClasses } from '../spec-utils';

/* Rounded Tabs container. Geometry is identical to Segmented (delegates
   to Filter chip's chrome via `Tab.jsx`) — the single divergence is the
   per-tab corner radius, which steps from `sys.radius.full` (capsule)
   to `sys.radius.md` (8). The radius override lives on `.chorus-chip--rounded`
   in styles.css; the row container itself just sets the inter-tab gap.

   Carries the Edge fade affordance via `useScrollOverflow`, which
   toggles `data-overflow-end` whenever the row's scroll width exceeds
   its visible width — the mask rule in styles.css keys off that
   attribute. */
export function TabsRounded({ fullWidth: _ignored, className, style, children, ...rest }) {
  const ref = useRef(null);
  useScrollOverflow(ref);
  const composedStyle = {
    '--tabs-container-padding-block': tokenToCss(spec.sizing.containerPaddingBlock),
    '--tabs-container-padding-inline': tokenToCss(spec.sizing.containerPaddingInline),
    '--tabs-inter-segment-gap': tokenToCss(spec.sizing.interTabGap),
    '--tabs-fade-width': tokenToCss(spec.sizing.fadeWidth),
    ...style,
  };
  return (
    <div
      ref={ref}
      className={joinClasses('chorus-tabs', 'chorus-tabs--segmented', 'chorus-tabs--rounded', className)}
      style={composedStyle}
      {...rest}
    >
      {children}
    </div>
  );
}
