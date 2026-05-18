import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { slugify } from '../lib/slugify';
import { dedupeSlug } from '../lib/componentMd';
import { ComponentPreview } from './ComponentPreview';
import { SemTable } from './SemTable';

/* Renders the body of a per-component spec from `schema/components/<name>/
   <name>.md`. The page header (title + description) is hoisted out by
   `lib/componentMd.parseComponentMd` and rendered by the route shell, so this
   component only consumes the body — everything from the `>` callout or the
   first `##` heading onward.

   Output participates in the `.page-content` tag-based styling: `##` lands as
   `<h2>` (the page's major section anchor), `###` as `<h3>`, and so on, with
   ids derived from heading text so the side-nav toc / in-page anchors line
   up. Tables map onto `sem-table.equal-cols` (column count taken from the
   first thead row); bullet lists pick up the `rule-list` card chrome; the
   leading `>` block becomes a `component-callout`. */

function headingText(children) {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(headingText).join('');
  if (children?.props?.children) return headingText(children.props.children);
  return '';
}

function countColumnsFromTableNode(node) {
  const thead = node?.children?.find((c) => c.tagName === 'thead');
  const firstRow = thead?.children?.find((c) => c.tagName === 'tr');
  if (!firstRow) return 2;
  return firstRow.children.filter((c) => c.tagName === 'th').length || 2;
}

/* Build the components map per render so each <ComponentMd> instance
   carries its own slug-dedup state — see `dedupeSlug` in lib/componentMd.
   Without per-instance Maps a long-running session would accumulate
   collisions across pages and rename "Slots" to "slots-2" the first time
   the user clicks a different component. */
function buildComponents(family) {
  const seenH2 = new Map();
  const seenH3 = new Map();
  return {
  // Spec body never carries an h1 — the title was hoisted into the page
  // header. If one slips in, render it harmlessly as a section heading.
  h1: ({ children }) => <h2 id={dedupeSlug(seenH2, slugify(headingText(children)))}>{children}</h2>,
  h2: ({ children }) => <h2 id={dedupeSlug(seenH2, slugify(headingText(children)))}>{children}</h2>,
  h3: ({ children }) => <h3 id={dedupeSlug(seenH3, slugify(headingText(children)))}>{children}</h3>,
  h4: ({ children }) => <h4>{children}</h4>,
  ul: ({ children }) => <ul className="rule-list">{children}</ul>,
  ol: ({ children }) => <ol className="rule-list">{children}</ol>,
  blockquote: ({ children }) => <blockquote className="component-callout">{children}</blockquote>,
  table: ({ node, children }) => (
    <SemTable
      className="equal-cols"
      style={{ '--equal-cols': countColumnsFromTableNode(node) }}
    >
      {children}
    </SemTable>
  ),
  thead: ({ children }) => <div className="sem-table-head">{children}</div>,
  tbody: ({ children }) => <div className="sem-table-body">{children}</div>,
  tr: ({ children }) => <div className="sem-row">{children}</div>,
  th: ({ children }) => <div className="sem-cell">{children}</div>,
  td: ({ children }) => <div className="sem-cell">{children}</div>,
  // Inline `code` renders as `.token-chip`; a fenced ` ```preview ` block
  // resolves to a live specimen (see ComponentPreview) — the fence body
  // carries the registry id and the source the docs displays for copy.
  code: ({ className, children }) => {
    const match = /language-([\w-]+)/.exec(className || '');
    if (match?.[1] === 'preview') {
      return <ComponentPreview body={String(children)} />;
    }
    if (match) return <code className={className}>{children}</code>;
    return <code className="token-chip">{children}</code>;
  },
  // Strip the `<pre>` wrapper for preview fences so the specimen frame isn't
  // boxed inside a code-block style; keep it for any other fenced block.
  pre: ({ children }) => {
    const inner = children?.props?.className || '';
    if (/language-preview/.test(inner)) return <>{children}</>;
    return <pre>{children}</pre>;
  },
  a: ({ href, children }) => {
    const sub = family ? parseSiblingSubHref(href) : null;
    if (sub) return <a href={`/components/${family}/${sub}`}>{children}</a>;
    return <a href={href}>{children}</a>;
  },
  };
}

/* Spec authors link to a sibling sub-component spec by relative path —
   `[FAB](./fab.md)` from button.md, for instance. The schema folder isn't
   a routable tree; rewrite those into the docs URL `/components/<family>/<sub>`
   so the link lands on the rendered sub-page. Returns the sub slug or null. */
function parseSiblingSubHref(href) {
  if (!href) return null;
  const m = href.match(/^(?:\.\/)?([\w-]+)\.md$/);
  return m ? m[1] : null;
}

export function ComponentMd({ body, family }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={buildComponents(family)}>
      {body}
    </ReactMarkdown>
  );
}
