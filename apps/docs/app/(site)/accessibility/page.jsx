import { Accessibility } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function AccessibilityPage() {
  return (
    <RouteShell
      header={{
        title: 'Accessibility',
        description:
          'Accessibility in Chorus is a property of the token system, not a checklist applied at the end. The color quartets clear contrast by construction; the focus ring is a system primitive, not a per-component flourish; the type scale and tap targets are sized so they work without zoom. This chapter consolidates the accessibility guarantees the foundations already provide and names the rules every product surface must follow on top of them.',
      }}
    >
      <Accessibility />
    </RouteShell>
  );
}
