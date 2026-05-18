import { AgentGuide } from '../../../components/sections';
import { RouteShell } from '../../../components/RouteShell';

export default function AgentGuidePage() {
  return (
    <RouteShell
      header={{
        title: 'Agent guide',
        description:
          "Chorus is designed to be ingested as a single canonical context by AI design agents (Claude Design, automation tools). This document is that context — pass it whole, alongside the JSON values in schema/tokens/, and the agent has everything it needs to produce on-system output. The three sections below are the working surface: a quick lookup table, example prompts in the system's vocabulary, and the iteration rules an agent should respect when proposing changes.",
      }}
    >
      <AgentGuide />
    </RouteShell>
  );
}
