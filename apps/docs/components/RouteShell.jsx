'use client';

import { usePathname } from 'next/navigation';
import { PageNav } from './PageNav';
import { RoutePageNav } from './RoutePageNav';
import { findNavLabel } from '../lib/nav';

/* `toc` lets a route hand its TOC in directly — needed by component sub-
   pages, whose headings come from each component's markdown spec and so
   can't be pre-declared in `lib/nav.js` the way the foundation routes are.
   When omitted, falls back to the pathname-keyed lookup in RoutePageNav. */
export function RouteShell({ children, header, toc }) {
  const pathname = usePathname();
  const label = findNavLabel(pathname);
  const resolvedHeader = header ?? (label ? { title: label } : null);
  return (
    <>
      {resolvedHeader ? (
        <header className="page-header">
          <div className="page-header-inner">
            <h1 className="page-header-title">{resolvedHeader.title}</h1>
            {resolvedHeader.description ? (
              <p className="page-header-desc">{resolvedHeader.description}</p>
            ) : null}
          </div>
        </header>
      ) : null}
      <div className="page-content">
        {children}
        {toc?.length ? <PageNav items={toc} /> : <RoutePageNav />}
      </div>
    </>
  );
}
