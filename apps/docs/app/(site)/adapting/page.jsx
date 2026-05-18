import { Adapting } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function AdaptingPage() {
  return (
    <RouteShell
      header={{
        title: 'Adapting Chorus',
        description:
          'Chorus is intentionally editable. The editing rules below describe how to change a token; the governance rules that follow describe who reviews, when changes ship, and how downstream consumers learn. Together they keep the layered token model honest as it changes.',
      }}
    >
      <Adapting />
    </RouteShell>
  );
}
