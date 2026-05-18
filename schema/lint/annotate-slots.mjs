#!/usr/bin/env node
// One-shot annotator: adds `accepts` and `intrinsic` fields to every slot in
// schema/components/*/*.spec.json based on a curated mapping. Idempotent —
// re-running leaves already-annotated slots intact (only fills missing fields).
//
// Usage: node schema/lint/annotate-slots.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const SELF = fileURLToPath(import.meta.url);
const SCHEMA_DIR = resolve(dirname(SELF), "..");

// Per spec, per slot annotations to merge in. Keyed by
// `<family>[/<sub>]` → `<slotName>` → { accepts?, intrinsic? }.
const ANNOTATIONS = {
  "navigation-bar/page": {
    leading: { accepts: ["icon", "button"] },
    title: { accepts: ["text"] },
    trailing: { accepts: ["icon", "button"] },
  },
  "navigation-bar/search": {
    leading: { accepts: ["button"] },
    input: { accepts: ["text"] },
    trailing: { accepts: ["button"] },
  },
  "dialog/dialog": {
    scrim: { intrinsic: true },
    container: { intrinsic: true },
    title: { accepts: ["text"] },
    image: { accepts: ["image"] },
    body: { accepts: ["text"] },
    actions: { accepts: ["button"] },
  },
  "tabs/underline": {
    label: { accepts: ["text"] },
    leadingIcon: { accepts: ["icon"] },
  },
  "tabs/rounded": {
    label: { accepts: ["text"] },
    leadingIcon: { accepts: ["icon"] },
  },
  "tabs/segmented": {
    label: { accepts: ["text"] },
    leadingIcon: { accepts: ["icon"] },
  },
  "chip/filter": {
    label: { accepts: ["text"] },
    leadingIcon: { accepts: ["icon"] },
    trailingIcon: { accepts: ["icon"] },
  },
  "chip/tag": {
    label: { accepts: ["text"] },
    trailingIcon: { accepts: ["icon"] },
  },
  "callout/callout": {
    container: { intrinsic: true },
    content: { intrinsic: true },
    icon: { accepts: ["icon", "image"] },
    body: { accepts: ["text"] },
    action: { accepts: ["button"] },
  },
  "channel-list/channel-list": {
    container: { intrinsic: true },
    header: { intrinsic: true },
    label: { accepts: ["text"] },
    headerAction: { accepts: ["button"] },
    pager: { intrinsic: true },
    page: { intrinsic: true },
    row: { intrinsic: true },
    avatar: { accepts: ["thumbnail"] },
    textColumn: { intrinsic: true },
    channelName: { accepts: ["text"] },
    followers: { accepts: ["text"] },
    description: { accepts: ["text"] },
    trailingAction: { accepts: ["button"] },
  },
  "channel-rail/channel-rail": {
    container: { intrinsic: true },
    track: { intrinsic: true },
    item: { intrinsic: true },
    avatar: { accepts: ["thumbnail"] },
    label: { accepts: ["text"] },
    trailingAction: { accepts: ["button"] },
  },
  "form-field/input": {
    group: { intrinsic: true },
    label: { accepts: ["text"] },
    container: { intrinsic: true },
    input: { accepts: ["text"] },
    clear: { intrinsic: true },
    helper: { accepts: ["text"] },
    count: { accepts: ["text"] },
  },
  "form-field/search": {
    container: { intrinsic: true },
    leading: { intrinsic: true },
    input: { accepts: ["text"] },
    clear: { intrinsic: true },
  },
  "badge/badge": {
    label: { accepts: ["text"] },
  },
  "thumbnail/thumbnail": {
    image: { accepts: ["image"] },
    updateDot: { intrinsic: true },
    logoBadge: { accepts: ["icon", "image"] },
  },
  "button/fab": {
    icon: { accepts: ["icon"] },
    label: { accepts: ["text"] },
  },
  "button/icon": {
    icon: { accepts: ["icon"] },
    "aria-label": { accepts: ["text"] },
  },
  "button/text": {
    label: { accepts: ["text"] },
    leadingIcon: { accepts: ["icon"] },
    trailingIcon: { accepts: ["icon"] },
  },
  "button/toggle": {
    label: { accepts: ["text"] },
    leadingIcon: { accepts: ["icon"] },
    trailingIcon: { accepts: ["icon"] },
  },
  "button/toolbar": {
    label: { accepts: ["text"] },
    leadingIcon: { accepts: ["icon"] },
    trailingIcon: { accepts: ["icon"] },
  },
};

function specPath(key) {
  const [family, sub] = key.split("/");
  return join(SCHEMA_DIR, "components", family, `${sub}.spec.json`);
}

let changed = 0;
let unchanged = 0;

for (const [key, slotAnn] of Object.entries(ANNOTATIONS)) {
  const path = specPath(key);
  const text = readFileSync(path, "utf8");
  const json = JSON.parse(text);
  let dirty = false;
  for (const [slotName, ann] of Object.entries(slotAnn)) {
    const slot = json.slots?.[slotName];
    if (!slot) {
      console.warn(`  ! ${key}: slot "${slotName}" not in spec`);
      continue;
    }
    if (ann.intrinsic && !slot.intrinsic) {
      slot.intrinsic = true;
      dirty = true;
    }
    if (ann.accepts && !slot.accepts) {
      slot.accepts = ann.accepts;
      dirty = true;
    }
  }
  if (dirty) {
    writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
    console.log(`✓ ${key}`);
    changed += 1;
  } else {
    unchanged += 1;
  }
}

console.log(`\n${changed} updated, ${unchanged} already current`);
