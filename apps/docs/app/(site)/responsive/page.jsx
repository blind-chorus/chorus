import { Responsive } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function ResponsivePage() {
  return (
    <RouteShell
      header={{
        title: 'Responsive behavior',
        description:
          'Three breakpoints carve the viewport into four named tiers (mobile → tablet → laptop → desktop). Token step-ups happen once, at the mobile→tablet line (800px); chrome layout shifts compose on top.',
      }}
    >
      <Responsive />
    </RouteShell>
  );
}
