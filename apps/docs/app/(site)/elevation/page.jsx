import { loadTokens } from '../../../lib/tokens';
import { Elevation } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function ElevationPage() {
  return (
    <RouteShell
      header={{
        title: 'Elevation',
        description:
          'Shadows are classified by the spatial role a surface plays, not by the component that uses it. A card and a selected list row both read as raised; a FAB and a dropdown both read as floating.',
      }}
    >
      <Elevation tokens={loadTokens()} />
    </RouteShell>
  );
}
