#!/usr/bin/env node
// One-shot annotator: adds `useCases` to each schema/components/<family>/<family>.family.json.
// Idempotent. Re-running leaves existing useCases intact.
//
// Usage: node schema/lint/annotate-usecases.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const SELF = fileURLToPath(import.meta.url);
const SCHEMA_DIR = resolve(dirname(SELF), "..");

const USE_CASES = {
  badge: ["unread count", "update count", "numeric indicator", "host attachment"],
  "bottom-sheet": [
    "short focused commit",
    "edge-anchored interruption",
    "action menu",
    "confirmation prompt",
    "one-thumb reach decision",
  ],
  button: [
    "primary commit",
    "inline action",
    "save and continue",
    "floating action",
    "icon-only action",
    "link-shaped action",
    "reversible state",
    "follow / unfollow",
    "toolbar action",
  ],
  callout: [
    "inline notice",
    "supplementary context",
    "tonal aside",
    "in-flow tip",
  ],
  "channel-list": [
    "channel directory",
    "suggested channels",
    "discover channels",
    "horizontal-paged channel suggestions",
  ],
  "channel-rail": [
    "joined channels nav",
    "compact horizontal channel switcher",
    "one-thumb channel nav",
  ],
  chip: [
    "facet selection",
    "filter toggle",
    "tag",
    "metadata pill",
    "dismissable opt-out",
  ],
  dialog: [
    "confirmation",
    "destructive confirmation",
    "image-led prompt",
    "centred modal",
    "short form",
  ],
  feed: [
    "content stream",
    "authored posts",
    "comments stream",
    "discussion thread",
    "timeline",
  ],
  "form-field": [
    "single-line text input",
    "labeled text field",
    "search input",
    "bare search pill",
  ],
  list: [
    "settings rows",
    "menu rows",
    "picker rows",
    "single-select option group",
    "drill-in navigation",
    "avatar-anchored rows",
    "directory rows",
  ],
  "navigation-bar": [
    "screen header",
    "landing-screen top bar",
    "drill-in top bar",
    "search top bar",
    "back navigation",
  ],
  tabs: [
    "section switcher",
    "content tabs",
    "chip tab row",
    "in-place mode toggle",
    "list-grid toggle",
  ],
  thumbnail: [
    "avatar",
    "channel image",
    "list leading image",
    "feed thumbnail",
    "circular image",
  ],
};

let changed = 0;
let unchanged = 0;

for (const [family, useCases] of Object.entries(USE_CASES)) {
  const path = join(SCHEMA_DIR, "components", family, `${family}.family.json`);
  const text = readFileSync(path, "utf8");
  const json = JSON.parse(text);
  if (json.useCases && json.useCases.length > 0) {
    unchanged += 1;
    continue;
  }
  // Insert useCases right after `description` for readability.
  const ordered = {};
  for (const [k, v] of Object.entries(json)) {
    ordered[k] = v;
    if (k === "description") ordered.useCases = useCases;
  }
  writeFileSync(path, JSON.stringify(ordered, null, 2) + "\n");
  console.log(`✓ ${family}`);
  changed += 1;
}

console.log(`\n${changed} updated, ${unchanged} already current`);
