'use client';

import { useEffect, useRef } from 'react';
import { Header } from './Header.jsx';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* Carousel — a labelled page region (renamed from Section). Wraps an
   optional Header (size="large") and a horizontal-pager body slot. The
   header anatomy is owned by the Header component so other hosts
   (in-sheet sub-sections, bounded cards) can reuse the same shape via
   `<Header />` directly.

   When both `label` and `headerAction` are omitted, the header row is
   suppressed entirely and the body sits flush against the surface's
   block padding — useful when the surrounding screen already provides
   a heading or the carousel is purely visual chrome.

   Link-affordance rule: the trailing headerAction is a Text Button
   `appearance="accent"` — enforced by Header itself. */

const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
const HEADER_WARNED = new WeakSet();

/* Dev-time guard: Carousel's `label` prop forwards into a Header at
   the top of the surface — Header owns the chrome, the typo, and the
   spacing. When a caller renders their own <h*> heading as a Carousel
   body child the chrome duplicates: Header sits at the top + the
   caller's <h*> re-indents the body, which is the canonical cause of
   the double-paid block padding inside Carousel we keep seeing in
   generated UIs. Warn once per element, dev only. Silent in
   production builds (NODE_ENV gate). */
function useCarouselLabelGuard(bodyRef) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') return;
    const body = bodyRef.current;
    if (!body || HEADER_WARNED.has(body)) return;
    const heading = Array.from(body.children).find((child) => HEADING_TAGS.has(child.tagName));
    if (!heading) return;
    HEADER_WARNED.add(body);
    // eslint-disable-next-line no-console
    console.warn(
      `[Chorus] <Carousel> direct child is a <${heading.tagName.toLowerCase()}> — Carousel already renders a labelled <Header> via its \`label\` prop. ` +
        `The sibling heading duplicates the chrome (Header at the top + your heading re-indents the body), which is the canonical cause of double-paid block padding inside Carousel. ` +
        `Fix: drop the heading from the body and pass the label through Carousel's prop — <Carousel label="…" headerAction={…}>{body}</Carousel>.`,
      heading,
    );
  });
}

export function Carousel({
  label,
  headerAction,
  children,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const ref = useRef(null);
  const bodyRef = useRef(null);
  useFullBleedGuard(ref, 'Carousel');
  useCarouselLabelGuard(bodyRef);
  const hasHeader = (label != null && label !== '') || headerAction != null;
  return (
    <section
      ref={ref}
      className={joinClasses('chorus-section', className)}
      data-headless={hasHeader ? undefined : 'true'}
      aria-label={ariaLabel ?? label}
      {...rest}
    >
      {hasHeader ? (
        <Header size="large" label={label} headerAction={headerAction} />
      ) : null}
      <div ref={bodyRef} className="chorus-section__body">{children}</div>
    </section>
  );
}
