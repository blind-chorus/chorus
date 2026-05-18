import { BorderStroke } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function BorderPage() {
  return (
    <RouteShell
      header={{
        title: 'Border & Stroke',
        description:
          'A four-step stroke-width scale paired with the existing color and radius tokens — borders are width × color × shape, and the width is the only axis that didn\'t have a token until now.',
      }}
    >
      <BorderStroke />
    </RouteShell>
  );
}
