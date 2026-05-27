'use client';

import { useRef } from 'react';
import { Header } from './Header.jsx';
import { joinClasses } from './spec-utils.js';
import { useFullBleedGuard } from './internal/useFullBleedGuard.js';

/* Section — a labelled page region. Wraps a Header (size="large") and a
   free-form body slot. The header anatomy is owned by the Header
   component so other hosts (in-sheet sub-sections, bounded cards) can
   reuse the same shape via `<Header />` directly.

   Link-affordance rule: the trailing headerAction is a Text Button
   `appearance="accent"` — enforced by Header itself. */
export function Section({
  label,
  headerAction,
  children,
  className,
  'aria-label': ariaLabel,
  ...rest
}) {
  const ref = useRef(null);
  useFullBleedGuard(ref, 'Section');
  return (
    <section
      ref={ref}
      className={joinClasses('chorus-section', className)}
      aria-label={ariaLabel ?? label}
      {...rest}
    >
      <Header size="large" label={label} headerAction={headerAction} />
      <div className="chorus-section__body">{children}</div>
    </section>
  );
}
