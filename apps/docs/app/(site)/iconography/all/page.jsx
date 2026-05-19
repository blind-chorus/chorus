import { AllIcons } from '../../../../components/sections';
import { RouteShell } from '../../../../components/RouteShell';

export default function AllIconsPage() {
  return (
    <RouteShell
      header={{
        title: 'All icons',
        description:
          'Full catalog of the @blind-dsai/ui/icons registry. Use this page to browse every glyph the system ships with before drawing a new one.',
      }}
    >
      <AllIcons />
    </RouteShell>
  );
}
