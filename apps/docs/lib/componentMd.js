import { slugify } from './slugify';

/* Splits a component spec markdown file into the three pieces the docs
   renderer consumes:

     - title:        the text after the single leading `# `.
     - description:  the first paragraph between `# Title` and the first `##`
                     or `>` callout. May be undefined if the file has none.
     - body:         everything from the `>` callout (if present) or the first
                     `##` heading onward, intact, ready to feed to react-markdown.

   Authoring contract enforced by `schema/components/README.md`:
     - exactly one `# ` heading, on the first non-blank line;
     - exactly one description paragraph between `#` and the first `##` / `>`;
     - `>` callouts only used for the leading "Inherits …" block.

   The split is line-based (no markdown AST) because the contract is small
   enough to express directly, and we want this to run on every page render. */

export function parseComponentMd(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  let i = 0;

  // Skip leading blank lines.
  while (i < lines.length && lines[i].trim() === '') i++;

  let title;
  if (lines[i] != null && lines[i].startsWith('# ')) {
    title = lines[i].slice(2).trim();
    i++;
  }

  // Walk forward to find where the body begins — the first line that starts
  // a `##` heading or a `>` callout. Anything we collect along the way that
  // is non-blank prose becomes the description.
  const descriptionLines = [];
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ') || line.startsWith('>')) break;
    if (line.trim() !== '') descriptionLines.push(line);
    i++;
  }
  const description = descriptionLines.length > 0 ? descriptionLines.join(' ').trim() : undefined;

  const body = lines.slice(i).join('\n').trim();

  return { title, description, body };
}

/* Builds the page-nav TOC for a component spec from its body markdown — one
   entry per top-level (`##`) heading, slugged the same way <ComponentMd>
   slugs heading anchors so the in-page links land. The list of component
   sub-routes is data-driven (folder-name = slug), so the TOC has to be too:
   we can't pre-declare it in `lib/nav.js` like the foundation pages do. */

/* Walks a base slug through a `seen` Map and appends a numeric suffix on
   collision. Shared by the TOC builder (here) and <ComponentMd>'s heading
   renderer so a heading title that recurs (e.g. "Slots" under both `## CTA`
   and `## FAB`) renders the same id in both places — the second occurrence
   becomes `slots-2`, the third `slots-3`, and so on. The first occurrence
   keeps the bare slug, which preserves every existing intra-page link. */
export function dedupeSlug(seen, slug) {
  const count = seen.get(slug) ?? 0;
  seen.set(slug, count + 1);
  return count === 0 ? slug : `${slug}-${count + 1}`;
}

export function extractTocFromMd(body) {
  if (!body) return [];
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const items = [];
  let current = null;
  const seenH2 = new Map();
  const seenH3 = new Map();
  for (const line of lines) {
    const m2 = line.match(/^## (.+?)\s*$/);
    if (m2) {
      const label = m2[1];
      current = { id: dedupeSlug(seenH2, slugify(label)), label, children: [] };
      items.push(current);
      continue;
    }
    /* H3 entries are nested under their preceding H2 so the page-nav for
       a component spec can surface variant / behaviour sub-sections (e.g.
       Primary / Secondary / Spacing / Truncation under CTA). H4 stays out
       of the TOC — it lives inside an H3 group as visual nesting only and
       would clutter the component sub-list. */
    const m3 = line.match(/^### (.+?)\s*$/);
    if (m3 && current) {
      const label = m3[1];
      current.children.push({ id: dedupeSlug(seenH3, slugify(label)), label });
    }
  }
  return items;
}

/* Pulls a single `###`-level section out of DESIGN.md by its slugified
   heading text and returns its body — everything between the heading and the
   next `## ` / `### ` heading. Used when the docs page wants to render a
   chunk of DESIGN.md (e.g. the Components-chapter scaffolding sections) so
   DESIGN.md stays the single source of truth instead of being mirrored as
   hardcoded JSX in sections.jsx.

   Returns `{ title, body }`; `body` is markdown ready for <ComponentMd>.
   Throws when the slug isn't found, since a missing section in DESIGN.md is
   a build-time bug, not a runtime fallback case. */

export function extractDesignSection(source, slug) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const headingRe = /^### (.+?)\s*$/;

  let i = 0;
  let title;
  for (; i < lines.length; i++) {
    const m = lines[i].match(headingRe);
    if (m && slugify(m[1]) === slug) {
      title = m[1];
      i++;
      break;
    }
  }
  if (title == null) {
    throw new Error(`extractDesignSection: no \`### …\` matching slug "${slug}" in DESIGN.md`);
  }

  const bodyLines = [];
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ') || line.startsWith('### ')) break;
    bodyLines.push(line);
  }

  // Strip thematic-break (`---`) lines — DESIGN.md uses them as chapter
  // delimiters between top-level `##` sections, and they leak into the last
  // `###` body of a chapter, rendering as a stray <hr> stroke.
  const body = bodyLines
    .filter((line) => !/^[ \t]*-{3,}[ \t]*$/.test(line))
    .join('\n')
    .trim();

  return { title, body };
}
