import { Components } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';
import { DesignSection } from '../../../components/DesignSection';
import { extractDesignSection } from '../../../lib/componentMd';
import { readDesignMd } from '../../../lib/schemaFs';

// `/components` is the chapter index. The chapter's framework-level sections
// (Why anatomy / Empty states / Loading & Skeleton states) are pulled out of
// DESIGN.md by heading slug at build time so the docs never drift from the
// canonical spec; the only docs-authored content on this page is the
// component directory (a navigation list to /components/<slug> sub-pages),
// rendered by <Components>.
const SCAFFOLDING = [
  { id: 'comp-why',     designSlug: 'why-anatomy-not-a-catalogue' },
  { id: 'comp-empty',   designSlug: 'empty-states' },
  { id: 'comp-loading', designSlug: 'loading-skeleton-states' },
];

export default function ComponentsPage() {
  const designMd = readDesignMd();
  const why     = extractDesignSection(designMd, 'why-anatomy-not-a-catalogue');
  const empty   = extractDesignSection(designMd, 'empty-states');
  const loading = extractDesignSection(designMd, 'loading-skeleton-states');

  return (
    <RouteShell
      header={{
        title: 'Components',
        description:
          'The token system bottoms out at components — Button and Chip are the seed pair the system is being built around. This chapter is the anatomy reference: what slots a component owns, which system tokens fill each slot, and the composition rules that hold across variants — plus the recurring patterns (empty states, loading) that ride on top. Other primitives are added back in sequence once Button and Chip are stable.',
      }}
    >
      <DesignSection id="comp-why"     title={why.title}     body={why.body} />
      <Components />
      <DesignSection id="comp-empty"   title={empty.title}   body={empty.body} />
      <DesignSection id="comp-loading" title={loading.title} body={loading.body} />
    </RouteShell>
  );
}
