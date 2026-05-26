#!/usr/bin/env node
// Copy the agent persona docs from the chorus monorepo into @blind-dsai/ui/agents
// so the published package self-contains everything an LLM agent needs to read.
//
// Sources (in the monorepo) → destinations (inside this package):
//   ../../AGENTS.md                       → agents/AGENTS.md
//   ../../prompt/LOVABLE.md               → agents/LOVABLE.md
//   ../../schema/catalog.md               → agents/catalog.md
//   ../../schema/manifest.json            → agents/manifest.json
//   ../../schema/DESIGN.md                → agents/DESIGN.md
//
// The repo root keeps AGENTS.md (auto-discovered by Cursor / Claude Code /
// Lovable at session start). Other agent-facing prompt files live in
// ../../prompt/ so they're grouped together for humans browsing the repo
// — Finder drag from prompt/ into a Lovable chat still works the same.
// The npm consumers get a flat agents/ tree via the copy below.
//
// Also copies the placeholder thumbnail so consumers can reference it via
// `@blind-dsai/ui/placeholder_thumbnail.png`:
//   ../../apps/docs/public/placeholder_thumbnail.png → placeholder_thumbnail.png

import { cpSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");
const repoRoot = resolve(pkgRoot, "..", "..");

// Wipe the agents/ tree before recreating so renamed/removed families
// (e.g. channel-list → suggestion-list) don't linger as ghost entries
// alongside the new ones — cpSync is additive, not a mirror.
const agentsRoot = resolve(pkgRoot, "agents");
rmSync(agentsRoot, { recursive: true, force: true });

const transfers = [
  { from: "AGENTS.md", to: "agents/AGENTS.md" },
  { from: "prompt/LOVABLE.md", to: "agents/LOVABLE.md" },
  { from: "schema/catalog.md", to: "agents/catalog.md" },
  { from: "schema/manifest.json", to: "agents/manifest.json" },
  { from: "schema/DESIGN.md", to: "agents/DESIGN.md" },
  // Icon intent → name map. The runtime exports live at
  // `@blind-dsai/ui/icons`; this JSON is the keyword routing the agent
  // uses to pick an icon by intent (e.g. "vote" → PollIcon) without
  // grepping dist/icons/index.d.ts.
  { from: "packages/ui/src/icons/keywords.json", to: "agents/icons.keywords.json" },
];

const optional = [
  { from: "apps/docs/public/placeholder_thumbnail.png", to: "placeholder_thumbnail.png" },
];

mkdirSync(agentsRoot, { recursive: true });

for (const { from, to } of transfers) {
  const src = resolve(repoRoot, from);
  const dst = resolve(pkgRoot, to);
  if (!existsSync(src)) {
    console.error(`[copy-agents] missing required source: ${from}`);
    process.exit(1);
  }
  cpSync(src, dst);
  console.log(`[copy-agents] ${from} → ${to}`);
}

for (const { from, to } of optional) {
  const src = resolve(repoRoot, from);
  if (!existsSync(src)) {
    console.warn(`[copy-agents] skipping optional asset (not found): ${from}`);
    continue;
  }
  cpSync(src, resolve(pkgRoot, to));
  console.log(`[copy-agents] ${from} → ${to}`);
}

// Pattern .md files (visual ground truth for screen-level grounding).
// .png files stay on GitHub — vision-capable agents fetch them on demand.
const patternsSrc = resolve(repoRoot, "patterns");
const patternsDst = resolve(pkgRoot, "agents/patterns");
if (existsSync(patternsSrc)) {
  cpSync(patternsSrc, patternsDst, {
    recursive: true,
    filter: (src) => {
      const stat = statSync(src);
      return stat.isDirectory() || src.endsWith(".md");
    },
  });
  console.log(`[copy-agents] patterns/*.md → agents/patterns/`);
} else {
  console.warn(`[copy-agents] skipping patterns (not found): patterns/`);
}

// Per-component contracts — slot grammar, props, anatomy. The single most
// important fidelity lever: without these, the agent knows "this should be
// a Section" from catalog.md but cannot answer "what slots / props does
// Section expose?" Ships every spec.json + .md + family.json under
// schema/components/. README.md is skipped (repo-meta only).
const componentsSrc = resolve(repoRoot, "schema/components");
const componentsDst = resolve(pkgRoot, "agents/components");
if (existsSync(componentsSrc)) {
  cpSync(componentsSrc, componentsDst, {
    recursive: true,
    filter: (src) => {
      const stat = statSync(src);
      if (stat.isDirectory()) return true;
      if (src.endsWith("/README.md")) return false;
      return (
        src.endsWith(".md") ||
        src.endsWith(".spec.json") ||
        src.endsWith(".family.json")
      );
    },
  });
  console.log(`[copy-agents] schema/components/** → agents/components/`);
} else {
  console.warn(
    `[copy-agents] skipping components (not found): schema/components/`,
  );
}

// Pre-validated screen recipes. Patterns' `.md` frontmatter cites
// these via `recipe: ../schema/screens/<slug>.screen.json`; shipping
// them keeps that link live inside the package.
const screensSrc = resolve(repoRoot, "schema/screens");
const screensDst = resolve(pkgRoot, "agents/screens");
if (existsSync(screensSrc)) {
  cpSync(screensSrc, screensDst, {
    recursive: true,
    filter: (src) => {
      const stat = statSync(src);
      if (stat.isDirectory()) return true;
      if (src.endsWith("/README.md")) return false;
      return src.endsWith(".screen.json") || src.endsWith(".schema.json");
    },
  });
  console.log(`[copy-agents] schema/screens/** → agents/screens/`);
} else {
  console.warn(`[copy-agents] skipping screens (not found): schema/screens/`);
}
