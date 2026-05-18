'use client';

import { useMemo, useState } from 'react';
import { icons as iconRegistry } from '@blind-chorus/ui/icons';
import { FormField } from '@blind-chorus/ui';
import { SemTable } from './SemTable';

/* All icons catalog. The grid is data-bound to the registry export from
   `@blind-chorus/ui/icons` — adding a new entry there surfaces it here on the
   next build. A keyword input above the table filters in-place by name
   and the `Icon.keywords` metadata each `makeIcon` call attaches. */

function matches(name, Icon, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  if (name.toLowerCase().includes(q)) return true;
  const keywords = Icon.keywords ?? [];
  return keywords.some((kw) => kw.toLowerCase().includes(q));
}

export function AllIcons() {
  const [query, setQuery] = useState('');

  const entries = useMemo(() => {
    return Object.entries(iconRegistry)
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([name, Icon]) => matches(name, Icon, query));
  }, [query]);

  return (
    <>
      <h2 id="icon-catalog">All icons</h2>
      <p>
        The complete <code>@blind-chorus/ui/icons</code> registry. Filter by name or
        keyword (e.g. <code>arrow</code>, <code>fill</code>, <code>chevron</code>).
        Filled variants (<code>*FillIcon</code>) carry the same glyph as their
        outlined sibling but mark a selected / committed state — pair them by
        intent, not for emphasis.
      </p>

      <div className="icon-catalog-search" role="search">
        <FormField
          variant="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="Search by name or keyword…"
          aria-label="Filter icons by name or keyword"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {entries.length === 0 ? (
        <p className="icon-catalog-empty">
          No icons match <code>{query}</code>. Check the spelling or browse the
          full catalog by clearing the filter.
        </p>
      ) : (
        <SemTable className="equal-cols" style={{ '--equal-cols': 4 }}>
          <div className="sem-table-head">
            {['Preview', 'Component', 'Import', 'Keywords'].map((h) => (
              <div key={h} className="sem-cell">{h}</div>
            ))}
          </div>
          <div className="sem-table-body">
            {entries.map(([name, Icon]) => (
              <div key={name} className="sem-row">
                <div className="sem-cell">
                  <span className="icon-catalog-glyph"><Icon size={24} /></span>
                </div>
                <div className="sem-cell">
                  <code className="token-chip">{name}</code>
                </div>
                <div className="sem-cell">
                  <code className="icon-catalog-import">
                    {`import { ${name} } from '@blind-chorus/ui/icons';`}
                  </code>
                </div>
                <div className="sem-cell">
                  <span className="icon-catalog-keywords">{(Icon.keywords ?? []).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </SemTable>
      )}
    </>
  );
}
