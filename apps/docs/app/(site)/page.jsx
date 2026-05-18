import {
  AboutChorus,
  WhatThisMeans,
  Scope,
  VisualTheme,
  TokenArchitecture,
} from '../../components/sections';
import { RouteShell } from '../../components/RouteShell';

export default function Page() {
  return (
    <RouteShell
      header={{
        title: 'Chorus',
        description:
          'The design system behind a product built on the belief that your voice matters — individual voices arranged into harmony through tokens every surface sings from. This page gathers what Chorus is, the visual atmosphere it produces, and the three-tier token model that makes it editable.',
      }}
    >
      <AboutChorus />
      <WhatThisMeans />
      <Scope />
      <VisualTheme />
      <TokenArchitecture />
    </RouteShell>
  );
}
