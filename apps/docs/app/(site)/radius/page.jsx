import { loadTokens } from '../../../lib/tokens';
import { Radius } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function RadiusPage() {
  return (
    <RouteShell
      header={{
        title: 'Radius',
        description:
          'A flat T-shirt scale chosen by visual role rather than raw value, so a global shape adjustment (more geometric vs. more rounded) is a single-file edit that cascades consistently across every surface.',
      }}
    >
      <Radius tokens={loadTokens()} />
    </RouteShell>
  );
}
