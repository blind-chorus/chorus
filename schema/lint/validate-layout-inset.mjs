#!/usr/bin/env node
// Validate layoutInset contracts across the family catalog and every screen recipe.
//
// `layoutInset` lives on each `<family>.family.json` and declares how the family
// contributes to the page's horizontal-rail contract:
//   - `full-bleed`   — direct child of the page shell; owns its own internal
//                       padding via layout.container.*; never wrapped in
//                       another padding-inline div.
//   - `bounded-surface` — its own modal / popover shell (dialog, bottom-sheet,
//                       toast, tooltip). Hosts content but is not a sibling
//                       of full-bleed page rows.
//   - `inline`       — slot atom (badge, button.standard, chip, form-field,
//                       thumbnail). No page-rail responsibility; lives inside
//                       another component's slot.
//
// Checks performed:
//   1. Catalog audit (hard fail). Every family in manifest.json declares
//      `layoutInset`.
//   2. Inline atom at page level (warning). A recipe region whose family
//      resolves to `inline` is flagged. Sometimes intentional (a chip group
//      acting as a filter rail, a button-text action bar, a form-field
//      stack) — in those cases the region must still sit as a direct child
//      of the page shell with no padding wrapper, so the warning serves as
//      a reminder to the rendering agent rather than a hard reject. The
//      single carve-out is `fab` (button/fab) which is viewport-pinned
//      chrome rather than a rail-responsible region.
//   3. bounded-surface hosting full-bleed nested binding (warning). When a
//      bounded-surface region's `props` / `items` reference a full-bleed
//      family (List, Feed, AvatarRail, …), the recipe's `note` / `rules`
//      should mention the negative-margin opt-out idiom (keywords:
//      marginInline / margin-inline / negative margin / opt-out / bleed)
//      so an agent that renders the recipe knows the child has to break
//      the surface's `layout.container.*` padding to keep its own row
//      padding as the visual inset.
//
// Usage:
//   node schema/lint/validate-layout-inset.mjs           # all recipes
//   node schema/lint/validate-layout-inset.mjs <slug>    # one or more recipe slugs
//
// Exits 0 unless check #1 fails. Checks #2 and #3 print "!" warnings to stdout
// but do not change the exit status.

import { fileURLToPath } from "node:url";
import { dirname, join, resolve, isAbsolute } from "node:path";
import { readJson } from "./utils.mjs";

const SELF = fileURLToPath(import.meta.url);
const SCHEMA_DIR = resolve(dirname(SELF), "..");

function fromSchema(p) {
  return isAbsolute(p) ? p : join(SCHEMA_DIR, p);
}

function loadManifest() {
  const override = process.env.CHORUS_MANIFEST_OVERRIDE;
  return readJson(override ? override : join(SCHEMA_DIR, "manifest.json"));
}

export function buildLayoutInsetMap(manifest) {
  const map = new Map();
  const missing = [];
  for (const c of manifest.components) {
    const family = readJson(fromSchema(c.root));
    if (!family.layoutInset) {
      missing.push(c.family);
      continue;
    }
    map.set(c.family, family.layoutInset);
  }
  return { map, missing };
}

const NEGATIVE_MARGIN_HINTS = [
  /margin-?inline/i,
  /negative margin/i,
  /opt[- ]?out/i,
  /\bbleed\b/i,
  /full-bleed child/i,
];

// Keywords in a region's `note` that signal the inline atom is intentionally
// placed at page-rail position as a group composition (filter chip rail,
// button action bar, form-field stack, viewport-pinned full-width button).
// When any of these match, the inline-at-page-level warning is suppressed.
const INLINE_GROUP_HINTS = [
  /\b(action\s+)?bar\b/i,
  /\brow\b/i,
  /\brail\b/i,
  /\bgroup\b/i,
  /\bstack\b/i,
  /\btoolbar\b/i,
  /\bpill\b/i,
  /\bfull[- ]width\b/i,
  /\bpinned\b/i,
];

function eachNestedFamily(value, out) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const v of value) eachNestedFamily(v, out);
    return;
  }
  if (typeof value.family === "string") {
    out.push(value.family);
  }
  for (const v of Object.values(value)) eachNestedFamily(v, out);
}

export function validateRecipe(recipe, layoutInsetMap) {
  const issues = [];
  const warnings = [];
  const regions = recipe.regions ?? {};

  for (const [regionName, binding] of Object.entries(regions)) {
    const family = binding.family;
    const inset = layoutInsetMap.get(family);

    if (!inset) {
      issues.push(
        `region "${regionName}": family "${family}" missing layoutInset in family.json`,
      );
      continue;
    }

    // Check #2: inline atom at page level (warning — sometimes intentional)
    if (inset === "inline") {
      const isFabCarveOut =
        regionName === "fab" &&
        family === "button" &&
        binding.subcomponent === "fab";
      const note = binding.note ?? "";
      const isIntendedGroup = INLINE_GROUP_HINTS.some((rx) => rx.test(note));
      if (!isFabCarveOut && !isIntendedGroup) {
        warnings.push(
          `region "${regionName}": inline atom "${family}${binding.subcomponent ? "/" + binding.subcomponent : ""}" sits at page-rail position with no group/row/rail/bar/stack hint in its note. If it's an intended group, name that in the note (e.g. "filter chip row", "action bar"); otherwise embed the atom inside another component's slot.`,
        );
      }
    }

    // Check #3: bounded-surface hosting full-bleed nested binding
    if (inset === "bounded-surface") {
      const nested = [];
      eachNestedFamily(binding.props ?? {}, nested);
      eachNestedFamily(binding.items ?? [], nested);
      const fullBleedNested = [
        ...new Set(
          nested.filter((n) => layoutInsetMap.get(n) === "full-bleed"),
        ),
      ];
      if (fullBleedNested.length > 0) {
        const haystack = [
          binding.note ?? "",
          ...(recipe.rules ?? []),
        ].join(" \n ");
        const hasHint = NEGATIVE_MARGIN_HINTS.some((rx) => rx.test(haystack));
        if (!hasHint) {
          warnings.push(
            `region "${regionName}": bounded-surface "${family}" hosts full-bleed child(ren) [${fullBleedNested.join(", ")}] — recipe note/rules should mention the negative-margin opt-out (marginInline / opt-out / bleed) so the rendering agent breaks the surface's padding correctly. See AGENTS.md § Composition rules.`,
          );
        }
      }
    }
  }

  return { issues, warnings };
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

function main() {
  const args = process.argv.slice(2);
  const manifest = loadManifest();
  const { map: layoutInsetMap, missing } = buildLayoutInsetMap(manifest);

  let totalIssues = 0;
  let totalWarnings = 0;

  if (missing.length > 0) {
    console.log(`✗ family catalog: ${missing.length} family/families missing layoutInset`);
    for (const m of missing) console.log(`  - ${m}`);
    totalIssues += missing.length;
  } else {
    console.log(`✓ family catalog: every family declares layoutInset (${layoutInsetMap.size} families)`);
  }

  const recipes = listRecipes(manifest, args);

  for (const r of recipes) {
    const recipe = readJson(fromSchema(r.root));
    const { issues, warnings } = validateRecipe(recipe, layoutInsetMap);
    if (issues.length === 0 && warnings.length === 0) {
      console.log(`✓ ${r.slug}`);
      continue;
    }
    if (issues.length === 0) {
      console.log(`✓ ${r.slug} (${warnings.length} warning${warnings.length === 1 ? "" : "s"})`);
    } else {
      console.log(`✗ ${r.slug}`);
    }
    for (const i of issues) console.log(`  - ${i}`);
    for (const w of warnings) console.log(`  ! ${w}`);
    totalIssues += issues.length;
    totalWarnings += warnings.length;
  }

  if (totalWarnings > 0) {
    console.log(`\n${totalWarnings} warning(s) — informational, do not fail the run.`);
  }
  if (totalIssues > 0) {
    console.log(`\n${totalIssues} issue(s)`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
