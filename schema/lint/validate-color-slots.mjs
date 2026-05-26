#!/usr/bin/env node
// validate-color-slots.mjs — enforce the slot allowlist for high-stakes
// color tokens (brand / primary / error / success).
//
// `tokens.usage.json` declares per-token `allowedComponents` /
// `forbiddenComponents`. This validator scans `packages/ui/src/styles.css`
// for every `var(--sys-color-<token>)` usage, extracts the parent CSS
// selector, maps it back to a Chorus component family, and:
//   - FAILS if the binding lands inside a family marked `forbiddenComponents`.
//   - WARNS if the binding lands outside `allowedComponents` (when the
//     allowlist is declared).
//
// Designed as the lint counterpart to Lovable's #8 — when a future spec
// edit puts brand red on a navigation-bar background or a default banner
// fill, this surfaces before the change merges.
//
// Usage: node schema/lint/validate-color-slots.mjs [--strict]
//   `--strict` promotes WARN to FAIL.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

const STRICT = process.argv.includes("--strict");

// Family slug → list of CSS-class prefixes that match this family's
// children. Used to map "I see `.chorus-foo__bar`" back to "family is
// `foo`". When a family ships multiple class roots (e.g. section also
// renders into post-carousel / profile-carousel) the list covers all.
const FAMILY_CLASS_PREFIXES = {
  "avatar-rail": [".chorus-avatar-rail"],
  badge: [".chorus-badge"],
  banner: [".chorus-banner"],
  "bottom-sheet": [".chorus-bottom-sheet"],
  button: [".chorus-button"],
  chip: [".chorus-chip"],
  dialog: [".chorus-dialog"],
  feed: [".chorus-feed", ".chorus-feed-ad", ".chorus-feed-group"],
  "form-field": [".chorus-form-field", ".chorus-field"],
  list: [".chorus-list"],
  "navigation-bar": [".chorus-navigation-bar"],
  section: [".chorus-section", ".chorus-post-carousel", ".chorus-profile-carousel"],
  "suggestion-list": [".chorus-suggestion-list"],
  "tab-bar": [".chorus-tab-bar"],
  tabs: [".chorus-tabs", ".chorus-tab"],
  thumbnail: [".chorus-thumbnail"],
  toast: [".chorus-toast"],
  tooltip: [".chorus-tooltip"],
};

const USAGE_PATH = resolve(ROOT, "schema/tokens/tokens.usage.json");
const STYLES_PATH = resolve(ROOT, "packages/ui/src/styles.css");

const usage = JSON.parse(readFileSync(USAGE_PATH, "utf8"));
const styles = readFileSync(STYLES_PATH, "utf8");

// Tokens that carry the slot allowlist — agent-pickable, high-stakes
// commit / state colors. We only validate these; broader color tokens
// (surface*, outlineVariant) have intent-level guidance only.
const GUARDED = Object.entries(usage.tokens).filter(
  ([, entry]) => entry.allowedComponents || entry.forbiddenComponents,
);

// Parse "feed/post (..)" → "feed". The slash-sub and the parenthesized
// note are ignored at the family-match level — class-name granularity
// caps at the family slug. Modifier suffixes ("--primary") are matched
// downstream against the full prefix, not the family.
function extractFamily(entry) {
  const head = entry.split(/[\s(]/)[0]; // "tab-bar/item--primary" → keep
  return head.split("/")[0]; // → "tab-bar"
}

// Walk the stylesheet, remembering the most recent top-level selector
// for every var(--sys-color-<TOKEN>) reference.
function findUsages(tokenName) {
  // CSS variable name on the wire matches camelCase via tokens.css
  // emission: sys.color.brand → --sys-color-brand. Preserve the same
  // casing tokens.css does (kebab-case for path, but the *sub*-paths
  // we have are camelCase like surfaceContainerHigh).
  const cssVar = tokenName.replace(/^sys\./, "--sys-").replace(/\./g, "-");
  const lines = styles.split(/\n/);
  const out = [];
  let currentSelector = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Top-level selector start (begins with `.` and ends with `{`).
    const selMatch = line.match(/^(\.[^{,]+)\s*\{/);
    if (selMatch) currentSelector = selMatch[1].trim();
    // Reset selector at top-level `}` (heuristic — works because we
    // only care about selectors that begin a block at column 0).
    if (/^}/.test(line)) currentSelector = null;
    if (line.includes(`var(${cssVar})`)) {
      out.push({ line: i + 1, selector: currentSelector, raw: line.trim() });
    }
  }
  return out;
}

function familyForSelector(selector) {
  if (!selector) return null;
  for (const [family, prefixes] of Object.entries(FAMILY_CLASS_PREFIXES)) {
    for (const p of prefixes) {
      // Prefix match — `.chorus-feed` matches `.chorus-feed__post-text`
      // and `.chorus-feed-group` (we listed feed-group explicitly). To
      // avoid `.chorus-feed*` swallowing `.chorus-feed-ad`, we already
      // listed feed-ad as its own prefix; first match wins.
      if (selector.startsWith(p + "_") || selector.startsWith(p + " ") || selector === p || selector.startsWith(p + ".") || selector.startsWith(p + ":")) {
        return family;
      }
    }
  }
  return null;
}

let failCount = 0;
let warnCount = 0;
const summary = [];

for (const [tokenName, entry] of GUARDED) {
  const allowed = (entry.allowedComponents || []).map(extractFamily);
  const forbidden = (entry.forbiddenComponents || []).map(extractFamily);
  const usages = findUsages(tokenName);

  if (usages.length === 0) continue;

  for (const u of usages) {
    const family = familyForSelector(u.selector);
    if (!family) {
      // Selector outside any known component family — skip silently
      // (likely a docs preview helper or a non-component class).
      continue;
    }
    if (forbidden.includes(family)) {
      console.error(
        `✗ FAIL ${tokenName} at line ${u.line} — selector "${u.selector}" maps to family "${family}", which is in forbiddenComponents.`,
      );
      failCount++;
      summary.push({ token: tokenName, line: u.line, selector: u.selector, family, kind: "forbidden" });
    } else if (allowed.length && !allowed.includes(family)) {
      const msg = `⚠ WARN ${tokenName} at line ${u.line} — selector "${u.selector}" maps to family "${family}", not in allowedComponents [${allowed.join(", ")}].`;
      if (STRICT) {
        console.error(msg.replace("⚠ WARN", "✗ FAIL"));
        failCount++;
        summary.push({ token: tokenName, line: u.line, selector: u.selector, family, kind: "not-allowed" });
      } else {
        console.warn(msg);
        warnCount++;
      }
    }
  }
}

if (failCount > 0) {
  console.error(`\n✗ ${failCount} hard violation(s) of color-slot contract.`);
  process.exit(1);
}
console.log(
  `✓ Color-slot bindings — ${GUARDED.length} guarded token(s) scanned, ${warnCount} warning(s) (run with --strict to fail).`,
);
