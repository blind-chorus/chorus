import { Guidelines } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function GuidelinesPage() {
  return (
    <RouteShell
      header={{
        title: "Do's & Don'ts",
        description:
          "Quick rules distilled from the system, organized as two paired columns: the practices to reach for and the patterns to avoid. Use them as a checklist when reviewing a surface — adopting a \"do\" while ignoring its matching \"don't\" leaves the system incoherent.",
      }}
    >
      <Guidelines />
    </RouteShell>
  );
}
