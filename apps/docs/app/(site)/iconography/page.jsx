import { Iconography } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function IconographyPage() {
  return (
    <RouteShell
      header={{
        title: 'Iconography',
        description:
          'A single icon family aligned to the typographic grid, sized by the type role it sits beside, and colored by the same on* foreground rule as the surrounding text — so an icon never needs its own color or size token.',
      }}
    >
      <Iconography />
    </RouteShell>
  );
}
