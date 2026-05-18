import { loadTokens } from '../../../lib/tokens';
import { Typography } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function TypographyPage() {
  return (
    <RouteShell
      header={{
        title: 'Typography',
        description:
          'One typeface (Pretendard) handles both Latin and Hangul, materialized as fifteen roles across five purpose categories × three sizes — weight and line-height carry meaning by purpose, not by size.',
      }}
    >
      <Typography tokens={loadTokens()} />
    </RouteShell>
  );
}
