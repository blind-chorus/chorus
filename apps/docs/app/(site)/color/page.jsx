import { loadTokens } from '../../../lib/tokens';
import { Color } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function ColorPage() {
  return (
    <RouteShell
      header={{
        title: 'Color',
        description:
          'Six solid hues plus two opacity overlays, organized into role clusters that always pair a background with its foreground — components consume system roles, never the raw palette.',
      }}
    >
      <Color tokens={loadTokens()} />
    </RouteShell>
  );
}
