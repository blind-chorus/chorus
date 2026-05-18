import { loadTokens } from '../../../lib/tokens';
import { Spacing } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function SpacingPage() {
  return (
    <RouteShell
      header={{
        title: 'Spacing & Layout',
        description:
          'An 8px base materializes into a percentage-keyed reference scale, then composes into four orthogonal layout axes — page → container → stack → inline — each owning one spatial relationship and stepping up automatically on web.',
      }}
    >
      <Spacing tokens={loadTokens()} />
    </RouteShell>
  );
}
