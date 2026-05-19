#!/usr/bin/env node
// Token-hygiene validator. Three checks, all static (no rendering):
//
//   1. Token-usage: every `sys.*` / `ref.*` / `comp.*` token referenced in
//      schema/components/<family>/<sub>.spec.json (and in @blind-dsai/ui/src/
//      *.jsx for token-bearing inline style strings) resolves to an entry
//      in schema/tokens/resolved.<theme>.json. Anything that *looks* like a
//      token ref but does not resolve is flagged.
//   2. Hex-collision: within a single resolved-theme bundle, no two distinct
//      `sys.color.*` roles are allowed to map to the same final hex. This
//      catches the dark-mode retune class of bug that the memory file
//      `feedback_optimization_process.md` flags.
//   3. Literal-color: spec.json / JSX / CSS in the renderer surfaces should
//      never carry raw hex (`#abc`), `rgba(...)`, `hsl(...)`, or ad-hoc
//      `color-mix(...)` with literal arguments — every color must trace to
//      a `sys.*` / `ref.*` token. Legitimate escape hatches (decorative
//      gradients, font-loading fallbacks) mark themselves with an inline
//      `/* chorus-token-exempt */` comment on or above the offending line.
//
// Usage:
//   node schema/lint/validate-tokens.mjs           # both themes
//   node schema/lint/validate-tokens.mjs light     # one theme
//
// Exits 0 if both checks pass, 1 otherwise.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, extname } from "node:path";

const SELF = fileURLToPath(import.meta.url);
const SCHEMA_DIR = resolve(dirname(SELF), "..");
const REPO_ROOT = resolve(SCHEMA_DIR, "..");

// A token reference is a tier prefix (`sys` / `ref` / `comp`) followed by
// one or more dot-separated alphanumeric segments. End must be alphanumeric
// (no trailing dot) so a partial reference in prose like `sys.state.*` does
// not match.
// Segments may start with a letter or a digit (e.g. `ref.space.500`,
// `sys.layout.container.2xs`). End must be alphanumeric (no trailing dot)
// so a partial reference like `sys.state.*` in a JSDoc comment is captured
// only up to `sys.state` and can be cross-checked against the bundle.
const TOKEN_RE = /\b(sys|ref|comp)(?:\.[a-zA-Z0-9][a-zA-Z0-9]*)+\b/g;

// `ref.<x>` patterns that are JS access, not design tokens (React refs).
// Anything starting with `ref.` that isn't in the resolved bundle is checked
// against this skiplist before being flagged.
const JS_REF_SKIP = new Set([
  "ref.current",
  "ref.children",
  "ref.props",
  "ref.value",
]);
// `sys.color.*` keys that are intentionally allowed to share a hex with one
// another. Pairs are joined by `==`. Add cautiously — the default is "no
// duplicates".
const COLLISION_ALLOWLIST = new Set([
  // Currently empty. Token retune is the preferred fix.
]);

function readJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

function loadThemes(themes) {
  const out = {};
  for (const t of themes) {
    out[t] = readJson(join(SCHEMA_DIR, "tokens", `resolved.${t}.json`));
  }
  return out;
}

function walkFiles(dir, extensions) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry.startsWith(".")) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) {
      out.push(...walkFiles(p, extensions));
    } else if (extensions.includes(extname(p))) {
      out.push(p);
    }
  }
  return out;
}

function collectTokenRefs() {
  // Sources: every spec.json (authoritative bindings) + every JSX file under
  // packages/ui/src (the renderer). We deliberately do NOT scan apps/docs —
  // its job is to consume @blind-dsai/ui, not to bind tokens directly.
  const refs = new Map(); // token → list of "file:line" call sites
  const specs = walkFiles(join(SCHEMA_DIR, "components"), [".json"])
    .filter((f) => f.endsWith(".spec.json"));
  const jsx = walkFiles(join(REPO_ROOT, "packages", "ui", "src"), [".jsx", ".js"])
    .filter((f) => !f.includes("/icons/"));

  for (const f of [...specs, ...jsx]) {
    const raw = readFileSync(f, "utf8");
    // For JS/JSX, strip block + line comments so tokens mentioned in prose
    // (JSDoc, inline notes) don't trigger usage flags. JSON has no comments.
    const text = /\.(jsx?|tsx?)$/.test(f)
      ? raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1")
      : raw;
    const lines = text.split("\n");
    lines.forEach((line, idx) => {
      const matches = line.match(TOKEN_RE);
      if (!matches) return;
      for (const m of matches) {
        if (!refs.has(m)) refs.set(m, []);
        refs.get(m).push(`${f.replace(REPO_ROOT + "/", "")}:${idx + 1}`);
      }
    });
  }
  return refs;
}

function checkUsage(refs, themes) {
  const issues = [];
  const allKeys = new Set();
  for (const bundle of Object.values(themes)) {
    for (const k of Object.keys(bundle)) allKeys.add(k);
  }
  for (const [tok, sites] of refs) {
    // `comp.*` is reserved-but-empty by design — skip.
    if (tok.startsWith("comp.")) continue;
    if (allKeys.has(tok)) continue;
    if (JS_REF_SKIP.has(tok)) continue;
    issues.push({ token: tok, sites: sites.slice(0, 3), more: Math.max(0, sites.length - 3) });
  }
  return issues;
}

// Categorize a `sys.color.*` key into a coarse "family". Intra-family hex
// collisions (e.g. the surface tonal ladder collapsing in one theme) are
// intentional. Inter-family collisions (e.g. `error` vs `onBrandContainer`)
// are the ones an agent or reviewer wants flagged.
function roleFamily(key) {
  const tail = key.replace(/^sys\.color\./, "");
  if (tail.startsWith("on")) return `fg:${tail.replace(/^on/, "").replace(/Container$/, "")}`;
  if (/^surface/i.test(tail) || /^inverseSurface/.test(tail)) return "surface";
  if (tail === "outline" || tail === "outlineVariant") return "outline";
  if (tail === "focus" || tail === "focusInset") return "focus";
  if (tail === "error" || tail === "errorContainer") return "error";
  if (tail === "brand" || tail === "brandContainer") return "brand";
  // Primary / secondary / tertiary + their containers
  const stem = tail.replace(/Container$/, "");
  return `accent:${stem}`;
}

// Literal-color hits we have audited and accepted as legitimate. Anything
// else triggers a hard fail (when strict). Prefer adding an inline
// `/* chorus-token-exempt */` marker at the call site over expanding this
// allowlist; the allowlist is for cases where the comment can't be placed
// near the literal (JSON, generated code, etc.).
const LITERAL_ALLOWLIST = new Set([
  // Decorative thumbnail-placeholder gradient — no equivalent token, the
  // shade exists only inside that one fallback chrome.
  "packages/ui/src/styles.css:963:#c8e0e1",
  "packages/ui/src/styles.css:963:#2d6f72",
  "packages/ui/src/styles.css:1033:#c8e0e1",
  "packages/ui/src/styles.css:1033:#2d6f72",
]);

// Regex set for literal colors. The function rejects matches that come
// from inside a `var(--…)` argument (token-bound).
const HEX_RE = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const RGB_RE = /\brgba?\(([^)]*)\)/g;
const HSL_RE = /\bhsla?\(([^)]*)\)/g;
const COLOR_MIX_RE = /\bcolor-mix\(([^)]*)\)/g;
const EXEMPT_MARKER = "chorus-token-exempt";

function checkLiterals() {
  // Sources: spec.json files (token bindings), packages/ui/src/*.jsx
  // (the renderer; .js too), and styles.css. Skip /icons/ (svg paths) and
  // any /tokens/ source files (literals are the whole point there).
  const sources = [];
  for (const f of walkFiles(join(SCHEMA_DIR, "components"), [".json"])) {
    if (f.endsWith(".spec.json")) sources.push(f);
  }
  const uiSrc = join(REPO_ROOT, "packages", "ui", "src");
  for (const f of walkFiles(uiSrc, [".jsx", ".js", ".css"])) {
    if (f.includes("/icons/")) continue;
    sources.push(f);
  }

  const findings = [];
  for (const f of sources) {
    const raw = readFileSync(f, "utf8");
    const isJs = /\.(jsx?|tsx?)$/.test(f);
    const text = isJs
      ? raw.replace(/\/\*[\s\S]*?\*\//g, (m) =>
          m.includes(EXEMPT_MARKER) ? m : " ".repeat(m.length),
        ).replace(/(^|[^:])\/\/.*$/gm, (_, p) => p)
      : raw;
    const lines = text.split("\n");
    const rawLines = raw.split("\n");
    lines.forEach((line, idx) => {
      const rawLine = rawLines[idx] ?? "";
      const prevRaw = rawLines[idx - 1] ?? "";
      // Per-line exemption: the marker on the line itself or the line above.
      if (rawLine.includes(EXEMPT_MARKER) || prevRaw.includes(EXEMPT_MARKER)) return;

      const rel = f.replace(REPO_ROOT + "/", "");

      // Hex outside var(--…) — strip var() spans before matching.
      const lineNoVars = line.replace(/var\([^)]*\)/g, "");
      for (const m of lineNoVars.matchAll(HEX_RE)) {
        const key = `${rel}:${idx + 1}:${m[0]}`;
        if (LITERAL_ALLOWLIST.has(key)) continue;
        findings.push({ file: rel, line: idx + 1, kind: "hex", value: m[0] });
      }
      // rgb()/rgba()/hsl()/hsla() with non-var arguments
      for (const re of [RGB_RE, HSL_RE]) {
        for (const m of line.matchAll(re)) {
          if (m[1].includes("var(")) continue;
          const key = `${rel}:${idx + 1}:${m[0]}`;
          if (LITERAL_ALLOWLIST.has(key)) continue;
          findings.push({
            file: rel,
            line: idx + 1,
            kind: m[0].startsWith("h") ? "hsl" : "rgb",
            value: m[0].slice(0, 40),
          });
        }
      }
      // color-mix() with literal (non-var) color arguments
      for (const m of line.matchAll(COLOR_MIX_RE)) {
        const args = m[1];
        // Walk arg list; flag if any color slot is a literal hex/rgb/hsl
        const argHasLiteral =
          /#[0-9a-fA-F]{3,8}\b/.test(args) ||
          /\brgba?\(/.test(args) ||
          /\bhsla?\(/.test(args);
        if (!argHasLiteral) continue;
        const key = `${rel}:${idx + 1}:color-mix`;
        if (LITERAL_ALLOWLIST.has(key)) continue;
        findings.push({
          file: rel,
          line: idx + 1,
          kind: "color-mix-literal",
          value: m[0].slice(0, 60),
        });
      }
    });
  }
  return findings;
}

function checkCollisions(theme, bundle) {
  const hexToRoles = new Map();
  for (const [key, val] of Object.entries(bundle)) {
    if (!key.startsWith("sys.color.")) continue;
    if (val?.$type !== "color") continue;
    const hex = (val.$value || "").toLowerCase();
    if (!hex) continue;
    const normalised = hex.replace(/ff$/, "");
    if (!hexToRoles.has(normalised)) hexToRoles.set(normalised, []);
    hexToRoles.get(normalised).push(key);
  }
  const significant = [];
  const intentional = [];
  for (const [hex, roles] of hexToRoles) {
    if (roles.length < 2) continue;
    const pairKey = roles.sort().join("==");
    if (COLLISION_ALLOWLIST.has(pairKey)) continue;
    const families = new Set(roles.map(roleFamily));
    if (families.size === 1) {
      intentional.push({ theme, hex, roles });
    } else {
      significant.push({ theme, hex, roles, families: [...families] });
    }
  }
  return { significant, intentional };
}

function main() {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict-collisions");
  const themeArgs = args.filter((a) => !a.startsWith("--"));
  const themes = themeArgs.length ? themeArgs : ["light", "dark"];
  const bundles = loadThemes(themes);

  const refs = collectTokenRefs();
  const usageIssues = checkUsage(refs, bundles);
  const literalIssues = checkLiterals();

  let allSignificant = [];
  let allIntentional = [];
  for (const t of themes) {
    const { significant, intentional } = checkCollisions(t, bundles[t]);
    allSignificant.push(...significant);
    allIntentional.push(...intentional);
  }

  console.log(`Token references found: ${refs.size}`);
  console.log(`Themes checked: ${themes.join(", ")}\n`);

  if (usageIssues.length === 0) {
    console.log("✓ Token usage — all references resolve");
  } else {
    console.log(`✗ Token usage — ${usageIssues.length} unresolved reference(s)`);
    for (const u of usageIssues) {
      console.log(`  - ${u.token}`);
      for (const s of u.sites) console.log(`      ${s}`);
      if (u.more) console.log(`      …and ${u.more} more`);
    }
  }

  if (literalIssues.length === 0) {
    console.log("✓ Literal colors — none outside the allowlist");
  } else {
    console.log(`✗ Literal colors — ${literalIssues.length} site(s) (add /* chorus-token-exempt */ on or above the line if intentional)`);
    for (const l of literalIssues) {
      console.log(`  - ${l.file}:${l.line} [${l.kind}] ${l.value}`);
    }
  }

  // Hex collisions are informational by default — many are intentional in
  // this near-monochromatic system (the whole surface ladder collapsing to
  // white in light mode, brand-as-error aliasing, etc.). Use --strict to
  // fail CI on cross-family collisions.
  if (allSignificant.length === 0) {
    console.log("✓ Cross-family hex collisions — none");
  } else {
    const marker = strict ? "✗" : "ℹ";
    console.log(`${marker} Cross-family hex collisions — ${allSignificant.length} group(s)${strict ? "" : " (informational; re-run with --strict to fail)"}`);
    for (const c of allSignificant) {
      console.log(`  - [${c.theme}] ${c.hex} ← ${c.roles.join(", ")} (families: ${c.families.join(" / ")})`);
    }
  }

  if (allIntentional.length > 0) {
    console.log(`\nℹ Intra-family hex collisions — ${allIntentional.length} group(s) (same role family resolving to one hex; always informational)`);
  }

  const failed =
    usageIssues.length > 0 ||
    literalIssues.length > 0 ||
    (strict && allSignificant.length > 0);
  process.exit(failed ? 1 : 0);
}

main();
