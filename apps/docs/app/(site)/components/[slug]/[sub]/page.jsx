import { notFound } from 'next/navigation';
import { RouteShell } from '../../../../../components/RouteShell';
import { ComponentMd } from '../../../../../components/ComponentMd';
import { extractTocFromMd, parseComponentMd } from '../../../../../lib/componentMd';
import { listComponentTree, readComponentMd } from '../../../../../lib/schemaFs';

/* `/components/<family>/<sub>` — sub-component anatomy page.

   Only emitted when the family folder has 2+ sub-md files; single-sub
   families collapse into the family page (see [slug]/page.jsx). */

export function generateStaticParams() {
  const params = [];
  for (const { family, subs } of listComponentTree()) {
    if (subs.length < 2) continue;
    for (const sub of subs) params.push({ slug: family, sub });
  }
  return params;
}

export default function SubComponentPage({ params }) {
  const entry = listComponentTree().find((e) => e.family === params.slug);
  if (!entry || entry.subs.length < 2 || !entry.subs.includes(params.sub)) notFound();

  const source = readComponentMd(entry.family, params.sub);
  const { title, description, body } = parseComponentMd(source);
  const toc = extractTocFromMd(body);

  return (
    <RouteShell header={{ title, description }} toc={toc}>
      <ComponentMd body={body} family={entry.family} />
    </RouteShell>
  );
}
