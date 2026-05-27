'use client';

import { useEffect } from 'react';

// Dev-only sanity check for `layoutInset="full-bleed"` family components.
// On mount, measure the parent element's computed padding-inline and the
// component's own margin-inline. If the effective rail inset is positive
// (parent padding not negated by negative margin opt-out), the page rail
// is being double-paid — warn once per element with a fix recipe.
//
// Silent in production builds (dead-code-eliminated by the bundler when
// process.env.NODE_ENV is statically resolvable). Falls back to a runtime
// check otherwise so we never warn end users.
//
// Why ResizeObserver / RO instead of a one-shot measurement: parent layout
// can shift after mount (font load, suspense boundary resolve, hydration
// commit on RSC routes). One useEffect tick can fire before the parent's
// padding is in its steady state and produce a false "all clear". The RO
// re-checks across the first few layout settlings; we still warn at most
// once per element via the WARNED WeakSet so a normal viewport resize
// doesn't spam the console.

const WARNED = new WeakSet();

function isDev() {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
    return process.env.NODE_ENV !== 'production';
  }
  return true;
}

function px(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function checkOnce(el, name) {
  if (!el || WARNED.has(el)) return;
  const parent = el.parentElement;
  if (!parent) return;

  const cs = getComputedStyle(parent);
  const padStart = px(cs.paddingInlineStart);
  const padEnd = px(cs.paddingInlineEnd);
  if (padStart === 0 && padEnd === 0) return;

  const selfCs = getComputedStyle(el);
  // Self-padding is the other half of the rail inset. When the
  // component has zeroed it (embedded mode — opt-in prop or DOM-
  // ancestry safety net inside Section / Feed), the parent's gutter
  // is paid once and there's no double-pay to warn about.
  if (px(selfCs.paddingInlineStart) === 0 && px(selfCs.paddingInlineEnd) === 0) return;

  const marginStart = px(selfCs.marginInlineStart);
  const marginEnd = px(selfCs.marginInlineEnd);

  const effectiveStart = padStart + marginStart;
  const effectiveEnd = padEnd + marginEnd;
  if (effectiveStart <= 0 && effectiveEnd <= 0) return;

  WARNED.add(el);
  // eslint-disable-next-line no-console
  console.warn(
    `[Chorus] <${name}> is layoutInset="full-bleed" — direct child of the page shell, owns its internal row/header padding via layout.container.*. ` +
      `Parent padding-inline (${padStart}px / ${padEnd}px) leaves an effective rail inset of ${effectiveStart}px / ${effectiveEnd}px on this instance, ` +
      `so the page gutter is double-paid and section headings, list-row leading content, chip rails, and feed-item author blocks land at different rails. ` +
      `Fix: either remove the parent's padding-inline (the page shell pays the gutter once at <main>), or — if the parent is a bounded surface ` +
      `(Card / Dialog / BottomSheet / Sheet) — apply the negative-margin opt-out idiom: ` +
      `style={{ marginInline: 'calc(-1 * var(--sys-layout-container-md))', width: 'calc(100% + 2 * var(--sys-layout-container-md))', maxWidth: 'none' }}. ` +
      `See LOVABLE.md §A.4 and AGENTS.md § Composition rules.`,
    el,
  );
}

export function useFullBleedGuard(ref, name) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isDev()) return;
    const el = ref.current;
    if (!el) return;

    // First-tick check after layout commit.
    checkOnce(el, name);

    // Re-check on parent / self size changes (font load, hydration shifts,
    // suspense fallback → real content swap). Cheap; only runs in dev.
    const ro = new ResizeObserver(() => checkOnce(el, name));
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [ref, name]);
}
