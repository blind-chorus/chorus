#!/usr/bin/env node
// Regenerates lovable-export/ as a 3-bucket "manual import" staging tree
// matched to the macOS Finder drag/drop workflow into the Lovable target
// repo (see lovable-export/IMPORT.md):
//
//   import/step1-merge-to-root/    → dragged to repo root, "Merge"
//     ├ public/                    (generated: shared image assets)
//     └ src/                       (generated: styles.css; tracked: routes, lib, ...)
//   import/step2-replace-to-root/  → dragged to repo root, "Replace"
//     ├ docs/                      (generated: chorus docs/specs/tokens/patterns)
//     └ {package.json, AGENTS.md, ...}  (tracked: config + guides)
//   import/step3-replace-to-src/   → dragged into target's src/, "Replace"
//     └ components/chorus/         (generated: ported chorus components + specs)
//
// The split exists because the three buckets land at different filesystem
// depths (root vs root vs src/), and macOS Finder can't choose
// merge-vs-replace per-folder inside a single drag. Each generated output
// MUST live in exactly one of the three buckets — there is no flat mirror.
//
// Run via `npm run build:lovable` from the repo root.

import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const tokensCssPath = resolve(repoRoot, "schema/tokens/tokens.css");
const importDir = resolve(repoRoot, "lovable-export/import");
const step1Dir = resolve(importDir, "step1-merge-to-root");
const step2Dir = resolve(importDir, "step2-replace-to-root");
const step3Dir = resolve(importDir, "step3-replace-to-src");
const outPath = resolve(step1Dir, "src/styles.css");
const docsOutDir = resolve(step2Dir, "docs");
const componentsOutDir = resolve(step3Dir, "components/chorus");
const COMPONENTS_README = `# \`src/components/chorus/\`

**This folder is the chorus design system surface inside the Lovable repo.**

Contents are generated from the chorus monorepo (\`packages/ui/src/\`) and synchronized via \`scripts/build-lovable.mjs\` in that repo. Do not hand-edit files here — the next sync will overwrite them. To change a chorus component, open an issue or PR against the chorus repo, then re-run the export.

## Usage rule

When building UI with the Lovable editor:

1. **Use \`@/components/chorus/*\` first.** It carries the chorus design language — tokens, spacing, radius, focus rings, color pairs, no-layout strokes — already wired in.
2. Fall back to \`@/components/ui/*\` (shadcn) only when no chorus equivalent exists for the primitive you need.
3. Never restyle a chorus component with raw Tailwind colors / arbitrary pixel values. If you need a variant that doesn't exist, that is a chorus change — request it upstream rather than patching here.

See the root \`AGENTS.md\` and \`docs/DESIGN.md\` for the full design contract.
`;

const BASELINE = `@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/*
 * Design system definition.
 *
 * The @theme inline block maps CSS custom properties to Tailwind utility
 * classes (e.g. --color-primary -> bg-primary, text-primary).
 *
 * The :root and .dark blocks define the actual color values using oklch.
 * All colors MUST use oklch format.
 *
 * To add a new semantic color:
 * 1. Add the variable to :root (light value) and .dark (dark value)
 * 2. Register it in @theme inline as --color-<name>: var(--<name>)
 */

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-ring-offset-background: var(--background);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.968 0.007 247.896);
  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.704 0.04 256.788);
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
}

@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}
`;

async function main() {
  const tokensCss = await readFile(tokensCssPath, "utf8");

  // The tokens file targets `data-theme="dark"`, but the Lovable template uses
  // `.dark` (registered via @custom-variant). Mirror our dark block onto `.dark`
  // so Tailwind's dark utilities and our chorus tokens stay in sync.
  const darkBlock = extractBlock(tokensCss, /\[data-theme="dark"\]\s*\{/);
  const darkMirror = darkBlock ? `\n.dark {\n${darkBlock}\n}\n` : "";

  const banner = [
    "/*",
    " * Chorus design tokens — appended automatically by scripts/build-lovable.mjs.",
    " * Do NOT hand-edit this section. Edit schema/tokens/ instead and re-run",
    " * `npm run build:lovable` from the chorus repo root.",
    " */",
    "",
  ].join("\n");

  const out = `${BASELINE}\n${banner}${tokensCss}${darkMirror}`;
  await writeFile(outPath, out, "utf8");
  console.log(`wrote ${outPath} (${out.length} bytes)`);

  await syncDocs();
  await syncComponents();
  await syncPublicAssets();
}

async function syncPublicAssets() {
  // Ship the shared public assets so paths like
  // `<Thumbnail src="/placeholder_thumbnail.png" />` and `<img src="/blind_logo_red.png" />`
  // resolve inside the Lovable repo too. `placeholder_thumbnail.png` is the
  // canonical image-area fallback (runtime load failures + design-time mocks);
  // `blind_logo_red.png` is the Blind brand mark.
  const publicOutDir = resolve(step1Dir, "public");
  await mkdir(publicOutDir, { recursive: true });
  const assets = ["placeholder_thumbnail.png", "blind_logo_red.png"];
  for (const asset of assets) {
    await copyFile(
      resolve(repoRoot, "apps/docs/public", asset),
      resolve(publicOutDir, asset),
    );
  }
  console.log(`synced ${assets.length} public assets → ${publicOutDir}`);
}

async function syncDocs() {
  // Wipe and rebuild docs/ each run so removed files in chorus disappear here too.
  await rm(docsOutDir, { recursive: true, force: true });
  await mkdir(docsOutDir, { recursive: true });

  // Top-level design docs.
  await copyDoc(resolve(repoRoot, "schema/DESIGN.md"), resolve(docsOutDir, "DESIGN.md"));
  await copyDoc(resolve(repoRoot, "schema/catalog.md"), resolve(docsOutDir, "catalog.md"));
  await copyFile(
    resolve(repoRoot, "schema/manifest.json"),
    resolve(docsOutDir, "manifest.json"),
  );

  // schema/components: per-family/sub md + spec/family JSON. These are the
  // machine-readable contracts — keep both shapes so the agent can pick a
  // component (md) and validate composition (json).
  await copyDocTree(
    resolve(repoRoot, "schema/components"),
    resolve(docsOutDir, "components"),
    [".md", ".json"],
  );

  // schema/screens: pre-validated screen recipes + the per-screen README.
  // screen.schema.json is the validation contract for *.screen.json.
  await copyDocTree(
    resolve(repoRoot, "schema/screens"),
    resolve(docsOutDir, "screens"),
    [".json", ".md"],
  );

  // schema/tokens: ship both the resolved value tables (path → value) and
  // the dependency graph (reference → system → component). The agent needs
  // resolved.* to pick a final value and the graph files to understand
  // semantic aliasing when retuning is required.
  await mkdir(resolve(docsOutDir, "tokens"), { recursive: true });
  for (const file of [
    "reference.json",
    "system.json",
    "component.json",
    "resolved.light.json",
    "resolved.dark.json",
    "resolved.web.json",
    "resolved.web.dark.json",
  ]) {
    await copyFile(
      resolve(repoRoot, "schema/tokens", file),
      resolve(docsOutDir, "tokens", file),
    );
  }

  // patterns/*.md + *.png → docs/patterns/ (canonical screen references —
  // Lovable can read the screenshots, so ship them alongside the md notes).
  await copyDocTree(
    resolve(repoRoot, "patterns"),
    resolve(docsOutDir, "patterns"),
    [".md", ".png"],
  );

  // High-level chorus consumption guide and the icons usage guide.
  await copyDoc(
    resolve(repoRoot, "CONSUMING.md"),
    resolve(docsOutDir, "CONSUMING.md"),
  );
  await mkdir(resolve(docsOutDir, "icons"), { recursive: true });
  await copyDoc(
    resolve(repoRoot, "schema/icons/README.md"),
    resolve(docsOutDir, "icons", "README.md"),
  );

  console.log(`synced docs → ${docsOutDir}`);
}

async function syncComponents() {
  // Wipe and rebuild components/chorus/ each run.
  await rm(componentsOutDir, { recursive: true, force: true });
  await mkdir(componentsOutDir, { recursive: true });

  // packages/ui/src — port .jsx and .js into TypeScript (Lovable's idiom)
  // and copy .css as-is. Skip the icon build pipeline: svg/, build-icons.mjs,
  // keywords.json, icons/README.md (icons/index.js is the generated artifact
  // and is all the consumer needs).
  const uiSrc = resolve(repoRoot, "packages/ui/src");
  const referencedSpecs = new Set();
  await portTree(uiSrc, componentsOutDir, (relPath) => {
    if (!/\.(jsx|js|css)$/.test(relPath)) return false;
    if (relPath.startsWith("icons/") && relPath !== "icons/index.js") return false;
    return true;
  }, "", referencedSpecs);

  // Copy every schema spec the components actually import, so the chorus
  // folder is self-contained inside the Lovable repo (no `../../../schema/`
  // dangle once the export is rsynced).
  for (const specRel of referencedSpecs) {
    const src = resolve(repoRoot, "schema/components", specRel);
    const dest = resolve(componentsOutDir, "specs", specRel);
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(src, dest);
  }
  if (referencedSpecs.size) {
    console.log(`synced ${referencedSpecs.size} component specs → ${resolve(componentsOutDir, "specs")}`);
  }

  await writeFile(resolve(componentsOutDir, "README.md"), COMPONENTS_README, "utf8");
  console.log(`synced components → ${componentsOutDir}`);
}

// Convert a JS-source tree (`.jsx`/`.js`) into a TypeScript-source tree
// (`.tsx`/`.ts`) suitable for the Lovable template. CSS is passed through.
// Each TS output file gets a `// @ts-nocheck` banner because chorus sources
// are untyped — strict mode would reject them otherwise. Relative-import
// extensions are stripped (`./foo.jsx` → `./foo`); bundler-mode resolution
// finds the new file by name.
async function portTree(srcDir, destDir, predicate, relPrefix = "", referencedSpecs) {
  const entries = await readdir(srcDir, { withFileTypes: true });
  let createdDir = false;
  const ensureDir = async () => {
    if (!createdDir) {
      await mkdir(destDir, { recursive: true });
      createdDir = true;
    }
  };

  for (const entry of entries) {
    const relPath = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
    const srcPath = resolve(srcDir, entry.name);
    if (entry.isDirectory()) {
      await portTree(srcPath, resolve(destDir, entry.name), predicate, relPath, referencedSpecs);
      continue;
    }
    if (!entry.isFile() || !predicate(relPath)) continue;
    await ensureDir();

    if (entry.name.endsWith(".css")) {
      await copyFile(srcPath, resolve(destDir, entry.name));
      continue;
    }

    const source = await readFile(srcPath, "utf8");
    const isJsx = entry.name.endsWith(".jsx") || hasJsxSyntax(source);
    const outExt = isJsx ? ".tsx" : ".ts";
    const outName = entry.name.replace(/\.(jsx|js)$/, outExt);
    const depth = relPath.split("/").length - 1; // 0 = top level, 1 = internal/, ...
    const specPrefix = depth === 0 ? "./specs" : `${"../".repeat(depth)}specs`;
    let rewritten = stripRelativeExtensions(source);
    rewritten = rewriteSchemaSpecImports(rewritten, specPrefix, referencedSpecs);
    const banner = "// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.\n";
    await writeFile(resolve(destDir, outName), banner + rewritten, "utf8");
  }
}

// Stricter JSX detector. Looks for closing tags (`</foo>`), self-closing
// tags (`<foo />`), capitalized component tags (`<Foo`), or a known set of
// HTML element names — patterns that would not appear in plain JS comparisons.
const JSX_PATTERNS = [
  /<\/[A-Za-z][\w.-]*\s*>/,
  /<[A-Za-z][\w.-]*\s+[\w-]+\s*=/,
  /<[A-Z][\w.-]*[\s/>]/,
  /<(svg|path|circle|rect|g|defs|div|span|button|input|p|h[1-6]|ul|li|ol|a|img|form|label|section|article|nav|header|footer|main|figure|figcaption|table|tr|td|th|thead|tbody|br|hr)\b/,
];
function hasJsxSyntax(source) {
  return JSX_PATTERNS.some((re) => re.test(source));
}

// Rewrite `from './foo.jsx'` / `from "../bar.js"` / `import('./baz.js')`
// to drop the extension. Only touches relative paths (`.` or `..` prefix);
// bare-module specifiers like `react` are untouched.
function stripRelativeExtensions(source) {
  return source.replace(
    /(from\s+['"]|import\(\s*['"])(\.\.?\/[^'"]+?)\.(jsx|js)(['"])/g,
    (_match, lead, path, _ext, quote) => `${lead}${path}${quote}`,
  );
}

// Rewrite `from '../../../schema/components/<family>/<file>.spec.json'` (and
// the deeper `../../../../schema/...` variant from `internal/`) to a path
// under the chorus folder's own `specs/` directory. Also record the matched
// `<family>/<file>.spec.json` in `referencedSpecs` so the caller can copy
// each spec file alongside the component source.
function rewriteSchemaSpecImports(source, specPrefix, referencedSpecs) {
  return source.replace(
    /(from\s+['"]|import\(\s*['"])(?:\.\.\/)+schema\/components\/([^'"]+\.spec\.json)(['"])/g,
    (_match, lead, specRel, quote) => {
      if (referencedSpecs) referencedSpecs.add(specRel);
      return `${lead}${specPrefix}/${specRel}${quote}`;
    },
  );
}

// Markdown link rewriter for files copied into lovable-export/docs/. Maps
// chorus-monorepo paths (e.g. `schema/tokens/reference.json`) onto the
// lovable-export layout (`tokens/reference.json`) so links resolve when the
// folder is opened from the Lovable repo. Only rewrites paths inside
// `()` (markdown link target), `<>` (autolinks), and backtick prose
// references — bare-prose mentions of "schema/" are left intact because
// they often discuss the chorus repo's structure as a concept.
const DOC_LINK_REWRITES = [
  // schema/manifest.json → manifest.json
  [/\bschema\/manifest\.json\b/g, "manifest.json"],
  // schema/DESIGN.md, schema/catalog.md → DESIGN.md, catalog.md
  [/\bschema\/(DESIGN\.md|catalog\.md)\b/g, "$1"],
  // schema/{components,screens,tokens}/... → {components,screens,tokens}/...
  [/\bschema\/(components|screens|tokens)\//g, "$1/"],
  // Bare directory references without trailing slash:
  //   schema/tokens → tokens, schema/components → components, schema/screens → screens
  [/\bschema\/(components|screens|tokens)\b/g, "$1"],
  // Relative back-references from subdirs (e.g. patterns/README.md uses
  // `../schema/components`). Collapse the `../schema/` into the parent dir.
  [/\.\.\/schema\//g, "../"],
];

function rewriteDocLinks(source) {
  let out = source;
  for (const [pattern, replacement] of DOC_LINK_REWRITES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

async function copyDoc(srcPath, destPath) {
  await mkdir(dirname(destPath), { recursive: true });
  if (!srcPath.endsWith(".md")) {
    await copyFile(srcPath, destPath);
    return;
  }
  const source = await readFile(srcPath, "utf8");
  await writeFile(destPath, rewriteDocLinks(source), "utf8");
}

async function copyDocTree(srcDir, destDir, exts) {
  const entries = await readdir(srcDir, { withFileTypes: true });
  await mkdir(destDir, { recursive: true });
  for (const entry of entries) {
    const srcPath = resolve(srcDir, entry.name);
    if (entry.isDirectory()) {
      await copyDocTree(srcPath, resolve(destDir, entry.name), exts);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!exts.some((ext) => entry.name.endsWith(ext))) continue;
    await copyDoc(srcPath, resolve(destDir, entry.name));
  }
}

async function copyTreeFiltered(srcDir, destDir, predicate, relPrefix = "") {
  const entries = await readdir(srcDir, { withFileTypes: true });
  let createdDir = false;
  for (const entry of entries) {
    const relPath = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
    const srcPath = resolve(srcDir, entry.name);
    if (entry.isDirectory()) {
      await copyTreeFiltered(srcPath, resolve(destDir, entry.name), predicate, relPath);
    } else if (entry.isFile() && predicate(relPath)) {
      if (!createdDir) {
        await mkdir(destDir, { recursive: true });
        createdDir = true;
      }
      await copyFile(srcPath, resolve(destDir, entry.name));
    }
  }
}

function extractBlock(source, openRegex) {
  const match = openRegex.exec(source);
  if (!match) return null;
  const start = match.index + match[0].length;
  let depth = 1;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return source.slice(start, i).trimEnd();
    }
  }
  return null;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
