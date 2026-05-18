import { VoiceContent } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function VoicePage() {
  return (
    <RouteShell
      header={{
        title: 'Voice & Content',
        description:
          'What the system says matters as much as how it looks. Voice & Content is the writing layer of Chorus — the rules that keep button labels, error messages, empty states, and microcopy coherent across surfaces and across translations.',
      }}
    >
      <VoiceContent />
    </RouteShell>
  );
}
