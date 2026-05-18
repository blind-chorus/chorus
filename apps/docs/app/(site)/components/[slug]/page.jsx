import { notFound } from 'next/navigation';
import { RouteShell } from '../../../../components/RouteShell';
import { ComponentMd } from '../../../../components/ComponentMd';
import { extractTocFromMd, parseComponentMd } from '../../../../lib/componentMd';
import { listComponentTree, readComponentMd } from '../../../../lib/schemaFs';

/* `/components/<family>` — the family page.

   Three shapes, governed by the family folder's sub-md count (see
   schema/components/README.md → "Single-spec vs sub-component families"):
     - 0 subs  → render <family>.md (full anatomy; e.g. chip)
     - 1 sub   → render <family>/<sub>.md (collapse rule — no /sub route)
     - 2+ subs → render <family>.md (overview; sub anatomies live at
                 /components/<family>/<sub> via the [sub] route) */

export function generateStaticParams() {
  return listComponentTree().map(({ family }) => ({ slug: family }));
}

function findFamily(slug) {
  return listComponentTree().find((entry) => entry.family === slug);
}

export default function ComponentPage({ params }) {
  const entry = findFamily(params.slug);
  if (!entry) notFound();

  const collapseSub = entry.subs.length === 1 ? entry.subs[0] : null;
  const source = collapseSub
    ? readComponentMd(entry.family, collapseSub)
    : readComponentMd(entry.family);
  const { title, description, body } = parseComponentMd(source);
  const toc = extractTocFromMd(body);

  return (
    <RouteShell header={{ title, description }} toc={toc}>
      <ComponentMd body={body} family={entry.family} />
    </RouteShell>
  );
}
