'use client';

import { usePathname } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageNav } from './PageNav';
import { RoutePageNav } from './RoutePageNav';
import { resolveMdHref } from './ComponentMd';
import { findNavLabel } from '../lib/nav';

/* Inline-only renderer for the page-header lead: every md doc puts
   cross-component `[Link](path)` references and `code` spans in the lead
   paragraph, so we parse it the same way as the body. `a` reuses the body
   renderer's md-href resolver so `./foo.md` / `../fam/bar.md` collapse to
   real routes instead of 404ing. */
function buildLeadComponents(family) {
  return {
    p: ({ children }) => <p className="page-header-desc">{children}</p>,
    a: ({ href, children }) => {
      const resolved = resolveMdHref(href, family);
      return <a href={resolved ?? href}>{children}</a>;
    },
  };
}

function familyFromPath(pathname) {
  const m = pathname?.match(/^\/components\/([\w-]+)/);
  return m ? m[1] : undefined;
}

/* `toc` lets a route hand its TOC in directly — needed by component sub-
   pages, whose headings come from each component's markdown spec and so
   can't be pre-declared in `lib/nav.js` the way the foundation routes are.
   When omitted, falls back to the pathname-keyed lookup in RoutePageNav. */
export function RouteShell({ children, header, toc }) {
  const pathname = usePathname();
  const label = findNavLabel(pathname);
  const resolvedHeader = header ?? (label ? { title: label } : null);
  /* The introduction route ('/') keeps the tonal hero band; every other
     route renders the header as bare typography (no background, no
     min-height). See `.page-header--intro` in globals.css. */
  const isIntro = pathname === '/';
  return (
    <>
      {resolvedHeader ? (
        <header className={`page-header${isIntro ? ' page-header--intro' : ''}`}>
          <div className="page-header-inner">
            <h1 className="page-header-title">{resolvedHeader.title}</h1>
            {resolvedHeader.description ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={buildLeadComponents(familyFromPath(pathname))}>
                {resolvedHeader.description}
              </ReactMarkdown>
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
