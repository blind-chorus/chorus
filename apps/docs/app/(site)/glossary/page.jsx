import { Glossary } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function GlossaryPage() {
  return (
    <RouteShell
      header={{
        title: 'Glossary',
        description:
          'A short reference to the Chorus-specific vocabulary that recurs across this document. Definitions are deliberately minimal — the section that introduces each term is the canonical source.',
      }}
    >
      <Glossary />
    </RouteShell>
  );
}
