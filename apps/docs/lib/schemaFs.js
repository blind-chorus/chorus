import fs from 'node:fs';
import path from 'node:path';

/* Server-only filesystem helpers for the schema/ source tree.

   The docs app lives at apps/docs and reads its content (DESIGN.md, per-
   component spec markdown) out of ../../schema. Multiple route segments need
   the same files, so we read each file once per process and memoize — at
   build time this just collapses redundant reads, and at dev time it keeps
   `next dev` snappy when the same DESIGN.md is requested by layout + page on
   every navigation. The cache is invalidated by file mtime, so edits in
   schema/ pick up on the next request without a server restart. */

const SCHEMA_DIR = path.join(process.cwd(), '..', '..', 'schema');
const COMPONENTS_DIR = path.join(SCHEMA_DIR, 'components');

const cache = new Map();

function readCached(filePath) {
  const stat = fs.statSync(filePath);
  const key = `${filePath}:${stat.mtimeMs}`;
  const hit = cache.get(filePath);
  if (hit && hit.key === key) return hit.source;
  const source = fs.readFileSync(filePath, 'utf8');
  cache.set(filePath, { key, source });
  return source;
}

export function readDesignMd() {
  return readCached(path.join(SCHEMA_DIR, 'DESIGN.md'));
}

/* Read a component spec by family slug, optionally with a sub-component slug.
   `readComponentMd('button')`         → schema/components/button/button.md
   `readComponentMd('button', 'cta')`  → schema/components/button/cta.md */
export function readComponentMd(family, sub) {
  const file = sub ? `${sub}.md` : `${family}.md`;
  return readCached(path.join(COMPONENTS_DIR, family, file));
}

/* Walk the components/ tree and return the family + sub-component map.

   For each family folder (any directory whose name matches a `<name>.md`
   inside it), collect every sibling `<sub>.md` whose slug differs from the
   family slug — those become sub-component pages. The shape directly drives
   route generation, the side-nav, and the family-page collapse rule for
   single-sub families.

   Memoized by the components-dir mtime; sub-md additions/removals inside an
   existing family folder bump that mtime via the dir's `withFileTypes` read,
   keeping the cache aligned with the filesystem without per-folder watchers. */
let treeCache;
export function listComponentTree() {
  const stat = fs.statSync(COMPONENTS_DIR);
  if (treeCache && treeCache.mtimeMs === stat.mtimeMs) return treeCache.tree;

  const families = fs
    .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => fs.existsSync(path.join(COMPONENTS_DIR, slug, `${slug}.md`)))
    .sort();

  const tree = families.map((family) => {
    const folder = path.join(COMPONENTS_DIR, family);
    const subs = fs
      .readdirSync(folder, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => entry.name.slice(0, -3))
      .filter((slug) => slug !== family)
      .sort();
    return { family, subs };
  });

  treeCache = { mtimeMs: stat.mtimeMs, tree };
  return tree;
}

