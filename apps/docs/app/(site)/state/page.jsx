import { loadTokens } from '../../../lib/tokens';
import { StateLayer } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function StatePage() {
  return (
    <RouteShell
      header={{
        title: 'State layers & Focus',
        description:
          "A single rule expresses every interactive state — paint a translucent layer of the element's foreground over its base, at the opacity defined by the state — and pairs with a three-layer focus ring for keyboard accessibility.",
      }}
    >
      <StateLayer tokens={loadTokens()} />
    </RouteShell>
  );
}
