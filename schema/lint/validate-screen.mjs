#!/usr/bin/env node
// Validate a Chorus screen recipe against the manifest + family/spec contracts.
//
// Checks performed (mirrors the validator list in /AGENTS.md):
//   1. Schema-level: every region references a `family` listed in manifest.json;
//      if `subcomponent` is given, it exists in that family's family.json.
//   2. Slot accepts: when a region's `props` or `items[*]` carry nested family
//      references, the target slot's `accepts` list (when present) admits the
//      nested family.
//   3. Required slots filled: for every region's resolved spec, every
//      slot with `required: true` is provided by `props` or `items` keys —
//      or excused via the recipe's `note` field.
//   4. Screen-level rules (from /AGENTS.md hard rules):
//      - At most one `navigation-bar` per recipe.
//      - At most one `button/fab` per recipe.
//      - Every `bottom-sheet` / `dialog` region must be paired with a trigger
//        somewhere else in the recipe (heuristic: a `note` mentioning the
//        overlay region, OR a row labelled like a confirm action).
//   5. Swappable lists, when present, reference real family slugs.
//
// Usage:
//   node schema/lint/validate-screen.mjs                  # all recipes
//   node schema/lint/validate-screen.mjs <slug> [<slug>]  # specific recipes
//
// Exits 0 if all recipes pass, 1 otherwise.

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, isAbsolute } from "node:path";

function fromSchema(p) {
  return isAbsolute(p) ? p : join(SCHEMA_DIR, p);
}

const SELF = fileURLToPath(import.meta.url);
const SCHEMA_DIR = resolve(dirname(SELF), "..");
const REPO_ROOT = resolve(SCHEMA_DIR, "..");

const PRIMITIVE_ACCEPTS = new Set(["text", "icon", "image"]);

function readJson(absPath) {
  return JSON.parse(readFileSync(absPath, "utf8"));
}

function loadManifest() {
  const override = process.env.CHORUS_MANIFEST_OVERRIDE;
  return readJson(override ? override : join(SCHEMA_DIR, "manifest.json"));
}

function loadFamily(manifest, familySlug) {
  const entry = manifest.components.find((c) => c.family === familySlug);
  if (!entry) return null;
  return {
    entry,
    family: readJson(fromSchema(entry.root)),
    dir: dirname(fromSchema(entry.root)),
  };
}

function loadSpec(manifest, familySlug, subSlug) {
  const f = loadFamily(manifest, familySlug);
  if (!f) return { error: `family not in manifest: ${familySlug}` };
  const subs = f.family.subcomponents ?? [];
  const target = subSlug
    ? subs.find((s) => s.slug === subSlug)
    : subs.find((s) => s.default) ?? subs[0];
  if (!target) return { error: `no sub-component for family ${familySlug}` };
  if (subSlug && !subs.find((s) => s.slug === subSlug)) {
    return { error: `sub-component ${subSlug} not in family ${familySlug}` };
  }
  return { spec: readJson(join(f.dir, target.spec)), sub: target };
}

function listRecipes(manifest, filterSlugs) {
  const all = manifest.screens ?? [];
  if (!filterSlugs.length) return all;
  return filterSlugs.map((slug) => {
    const hit = all.find((s) => s.slug === slug);
    if (!hit) throw new Error(`screen not in manifest: ${slug}`);
    return hit;
  });
}

function checkAccepts(slot, providedFamily, regionName, slotName, issues) {
  if (!slot.accepts) return;
  if (!providedFamily) return;
  if (!slot.accepts.includes(providedFamily)) {
    issues.push(
      `${regionName}.${slotName}: family "${providedFamily}" not in accepts ${JSON.stringify(slot.accepts)}`,
    );
  }
}

function validateRecipe(manifest, recipe) {
  const issues = [];
  const regions = recipe.regions ?? {};

  let navCount = 0;
  let fabCount = 0;
  const modalRegions = [];

  for (const [regionName, binding] of Object.entries(regions)) {
    const { family, subcomponent, props, items, note } = binding;

    if (family === "navigation-bar") navCount += 1;
    if (family === "button" && subcomponent === "fab") fabCount += 1;
    if (family === "bottom-sheet" || family === "dialog") {
      modalRegions.push({ regionName, note });
    }

    const loaded = loadSpec(manifest, family, subcomponent);
    if (loaded.error) {
      issues.push(`${regionName}: ${loaded.error}`);
      continue;
    }
    const spec = loaded.spec;
    const slots = spec.slots ?? {};

    const providedKeys = new Set([
      ...Object.keys(props ?? {}),
      ...(items && items.length ? Object.keys(items[0] ?? {}) : []),
    ]);

    for (const [slotName, slot] of Object.entries(slots)) {
      if (slot.required && !slot.intrinsic) {
        const filled =
          providedKeys.has(slotName) ||
          (note && note.toLowerCase().includes(slotName.toLowerCase()));
        if (!filled && !isIntrinsicSlot(slotName, family, subcomponent)) {
          issues.push(
            `${regionName}: required slot "${slotName}" not provided by props/items (and not excused by note)`,
          );
        }
      }
      const provided = props?.[slotName];
      if (provided && typeof provided === "object" && provided.family) {
        checkAccepts(slot, provided.family, regionName, slotName, issues);
      }
    }
  }

  if (navCount > 1) {
    issues.push(`screen-rule: ${navCount} navigation-bars (max 1)`);
  }
  if (fabCount > 1) {
    issues.push(`screen-rule: ${fabCount} FABs (max 1)`);
  }
  for (const { regionName, note } of modalRegions) {
    const triggered = recipeMentionsTrigger(recipe, regionName, note);
    if (!triggered) {
      issues.push(
        `screen-rule: modal region "${regionName}" has no paired trigger (add a row/action note that references this overlay)`,
      );
    }
  }

  const swap = recipe.swappable ?? {};
  for (const [regionName, list] of Object.entries(swap)) {
    if (!regions[regionName]) {
      issues.push(`swappable: region "${regionName}" not declared in regions`);
    }
    for (const fam of list) {
      if (!manifest.components.find((c) => c.family === fam)) {
        issues.push(`swappable.${regionName}: unknown family "${fam}"`);
      }
    }
  }

  return issues;
}

// Slots whose content is intrinsic to the component (auto-rendered chrome,
// container shells) and never "provided" as a prop — exclude from the
// required-fill check.
function isIntrinsicSlot(slotName, family, _subcomponent) {
  const intrinsic = new Set(["container", "row", "scrim", "backdrop", "handle"]);
  if (intrinsic.has(slotName)) return true;
  return false;
}

function recipeMentionsTrigger(recipe, overlayRegion, overlayNote) {
  const regions = recipe.regions ?? {};
  for (const [name, binding] of Object.entries(regions)) {
    if (name === overlayRegion) continue;
    const hay = JSON.stringify(binding).toLowerCase();
    if (hay.includes(overlayRegion.toLowerCase())) return true;
    if (hay.includes("trigger")) return true;
    if (hay.includes("opens the overlay")) return true;
  }
  if (overlayNote && /trigger|opens|fires/i.test(overlayNote)) return true;
  return false;
}

function main() {
  const args = process.argv.slice(2);
  const manifest = loadManifest();
  const recipes = listRecipes(manifest, args);

  let totalIssues = 0;
  for (const r of recipes) {
    const recipe = readJson(fromSchema(r.root));
    const issues = validateRecipe(manifest, recipe);
    if (issues.length === 0) {
      console.log(`✓ ${r.slug}`);
    } else {
      totalIssues += issues.length;
      console.log(`✗ ${r.slug}`);
      for (const i of issues) console.log(`  - ${i}`);
    }
  }

  if (totalIssues > 0) {
    console.log(`\n${totalIssues} issue(s)`);
    process.exit(1);
  }
}

// Export for programmatic use (e.g. the MCP server's validate_screen tool).
// `main()` only runs when this file is the process entrypoint, so importing
// the module is side-effect-free.
export { loadManifest, loadSpec, loadFamily, validateRecipe };

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
