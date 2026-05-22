#!/usr/bin/env node
// Regenerates lovable-export/ as a flat mirror of the Lovable-connected
// GitHub repo template (see lovable-export/IMPORT.md). The user's import
// workflow is a single macOS Finder drag of every entry inside
// lovable-export/ onto the cloned Lovable repo, with "Replace All" on the
// merge prompt — so the tree here must match the target layout 1:1.
//
//   lovable-export/
//     ├ public/                (generated: shared image assets)
//     ├ src/styles.css         (generated: tokens + Tailwind theme)
//     ├ src/components/chorus/ (generated: ported chorus components + specs)
//     ├ src/{routes,lib,hooks,...}  (tracked: TanStack scaffold)
//     ├ docs/                  (generated: chorus docs/specs/tokens/patterns)
//     └ {package.json, AGENTS.md, ...}  (tracked: config + guides)
//
// Run via `npm run build:lovable` from the repo root.

import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const tokensCssPath = resolve(repoRoot, "schema/tokens/tokens.css");
const exportDir = resolve(repoRoot, "lovable-export");
const outPath = resolve(exportDir, "src/styles.css");
const docsOutDir = resolve(exportDir, "docs");
const componentsOutDir = resolve(exportDir, "src/components/chorus");
const COMPONENTS_README = `# \`src/components/chorus/\`

**This folder is the chorus design system surface inside the Lovable repo.**

Contents are generated from the chorus monorepo (\`packages/ui/src/\`) and synchronized via \`scripts/build-lovable.mjs\` in that repo. Do not hand-edit files here — the next sync will overwrite them. To change a chorus component, open an issue or PR against the chorus repo, then re-run the export.

## Usage rule

When building UI with the Lovable editor:

1. **Use \`@/components/chorus/*\` for every UI primitive.** It carries the chorus design language — tokens, spacing, radius, focus rings, color pairs, no-layout strokes — already wired in.
2. **Do not introduce \`@/components/ui/*\` (shadcn) primitives.** The export deliberately ships no \`ui/\` folder. If a primitive you need doesn't exist in chorus, file a chorus issue / PR — never paper over the gap with shadcn or raw Tailwind.
3. Never restyle a chorus component with raw Tailwind colors / arbitrary pixel values. If you need a variant that doesn't exist, that is a chorus change — request it upstream rather than patching here.

See the root \`AGENTS.md\` and \`docs/DESIGN.md\` for the full design contract.
`;

const BASELINE = `@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/*
 * Chorus design system — PRIMARY contract.
 *
 * The actual chorus tokens (--sys-*, --ref-*, component-level vars) are
 * appended at the bottom of this file from schema/tokens/. Those are the
 * values you MUST use when composing UI: read them via the chorus
 * components under @/components/chorus/*, which already wire them.
 *
 * The shadcn @theme inline + oklch :root/.dark blocks below are a Tailwind
 * baseline kept verbatim so the Tailwind/vite pipeline boots. They are NOT
 * the design system. Do NOT introduce new components or screens that
 * consume bg-primary / text-foreground / arbitrary Tailwind colors —
 * that bypasses chorus and the design contract in
 * lovable-export/AGENTS.md. There is no shadcn fallback path here:
 * @/components/ui/ deliberately ships empty; missing primitives belong as
 * issues against the chorus repo, not as ad-hoc shadcn additions.
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
  const publicOutDir = resolve(exportDir, "public");
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

  // NOTE: deliberately do NOT ship CONSUMING.md or icons/README.md into the
  // export.
  //
  // CONSUMING.md opens with `npm install @blind-dsai/tokens @blind-dsai/ui`
  // instructions that are correct in the chorus monorepo context but
  // actively misleading inside a Lovable repo (where chorus is overlaid as
  // src/components/chorus/* and the npm packages don't exist). The Lovable
  // section at the bottom isn't enough to overcome the file's opening
  // framing — an agent reading the top first concludes "I need to npm
  // install" and never reaches the overlay section.
  //
  // icons/README.md is currently a placeholder ("Planned. Not yet
  // implemented.") with no agent value. When real icon docs land, restore
  // this copy.

  console.log(`synced docs → ${docsOutDir}`);
}

async function syncComponents() {
  // Wipe and rebuild components/chorus/ each run.
  await rm(componentsOutDir, { recursive: true, force: true });
  await mkdir(componentsOutDir, { recursive: true });

  // Build a basename → spec-path map by scanning every family.json. Used as
  // a fallback when a ported .jsx file does NOT directly import a spec: e.g.
  // Section.jsx fans out to sub-impls but is best understood through its
  // family's spec. PascalCase keys come from sub-slug kebab → pascal
  // (`bottom-sheet` → `BottomSheet`, `post-carousel` → `PostCarousel`).
  // Collisions (the same PascalCase name in two families) are dropped so the
  // mapping never silently picks the wrong family.
  const basenameToSpec = await buildBasenameSpecMap();
  const basenameToFamily = await buildBasenameFamilyMap();

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
  }, "", referencedSpecs, basenameToSpec, basenameToFamily);

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
async function portTree(srcDir, destDir, predicate, relPrefix = "", referencedSpecs, basenameToSpec, basenameToFamily) {
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
      await portTree(srcPath, resolve(destDir, entry.name), predicate, relPath, referencedSpecs, basenameToSpec, basenameToFamily);
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
    const fileSpecs = new Set();
    rewritten = rewriteSchemaSpecImports(rewritten, specPrefix, referencedSpecs, fileSpecs);
    const banner = "// @ts-nocheck — ported from chorus (untyped). Edit upstream, then re-run `npm run build:lovable`.\n";

    // Phase-1 type surface: if the ported file imports exactly one
    // spec.json, derive a TypeScript Props interface from it and annotate
    // the public function signature. This makes prop names, value sets,
    // and optionality visible to any TS-aware editor (and to AI agents
    // reading the file) — without us hand-writing types for 30+ files.
    // Family-wrapper files (like Button.jsx) that fan out to sub-impls
    // don't import a single spec and fall through this branch; their
    // types stay derived from the per-sub files. forwardRef wrappers also
    // skip — the signature shape doesn't fit the simple regex.
    const baseName = outName.replace(/\.(tsx|ts)$/, "");
    // Pick the spec to derive Props from. First preference: a spec the file
    // already imports (most accurate — that's literally what the impl reads).
    // Fallback: a family-level spec mapped by file basename (covers wrappers
    // that fan out to sub-impls without importing the spec themselves).
    let typeSpecRel = null;
    if (fileSpecs.size === 1) {
      [typeSpecRel] = [...fileSpecs];
    } else if (isJsx && depth === 0 && basenameToSpec?.has(baseName)) {
      typeSpecRel = basenameToSpec.get(baseName);
    }
    let typesGenerated = false;
    if (isJsx && typeSpecRel && !/forwardRef\s*\(/.test(rewritten)) {
      try {
        const spec = JSON.parse(
          await readFile(resolve(repoRoot, "schema/components", typeSpecRel), "utf8"),
        );
        const interfaceName = `${baseName}Props`;
        const elementType = htmlElementToTsType(spec.element);
        const propsInterface = specToPropsInterface(spec, interfaceName, elementType, typeSpecRel);
        rewritten = injectPropsInterface(rewritten, propsInterface, interfaceName);
        typesGenerated = true;
      } catch (err) {
        console.warn(`type-gen skipped for ${relPath}: ${err.message}`);
      }
    }
    // Fallback for family-wrapper files (variant-dispatchers — Button, Tabs,
    // Section, etc.) that don't reduce to a single spec. We can't safely
    // synthesize one Props interface, but we can hand the agent a navigable
    // pointer to the per-sub specs in this folder. The JSDoc lands directly
    // above the export so editor tooltips surface it.
    if (isJsx && !typesGenerated && depth === 0 && basenameToFamily?.has(baseName)) {
      const family = basenameToFamily.get(baseName);
      const blockComment = renderFamilyJsdoc(family, specPrefix);
      if (blockComment) rewritten = injectFamilyJsdoc(rewritten, blockComment);
    }

    await writeFile(resolve(destDir, outName), banner + rewritten, "utf8");
  }
}

// Walk schema/components/*/<family>.family.json files, collect every
// subcomponent's spec path, and key it by the PascalCase name the chorus
// source file most likely uses (`bottom-sheet` → `BottomSheet`,
// `post-carousel` → `PostCarousel`). Collisions (the same sub-slug across
// families — e.g. `thumbnail` is both `thumbnail/thumbnail.spec.json` and
// `list/thumbnail.spec.json`) are resolved in favor of the family-rooted
// sub (slug === family name); other collisions are dropped to avoid
// silently picking the wrong family.
async function buildBasenameSpecMap() {
  const componentsRoot = resolve(repoRoot, "schema/components");
  const families = await readdir(componentsRoot, { withFileTypes: true });
  // First pass: collect every candidate per PascalCase key with provenance.
  const candidates = new Map(); // pascal → [{ family, slug, specRel }, ...]
  for (const fam of families) {
    if (!fam.isDirectory()) continue;
    const famJsonPath = resolve(componentsRoot, fam.name, `${fam.name}.family.json`);
    let famJson;
    try {
      famJson = JSON.parse(await readFile(famJsonPath, "utf8"));
    } catch {
      continue;
    }
    const familyPascal = famJson.name ?? kebabToPascal(fam.name);
    for (const sub of famJson.subcomponents ?? []) {
      if (!sub?.spec) continue;
      const slug = sub.slug ?? sub.spec.replace(/\.spec\.json$/, "");
      const pascal = kebabToPascal(slug);
      const specRel = `${fam.name}/${sub.spec}`;
      const list = candidates.get(pascal) ?? [];
      list.push({ family: fam.name, slug, specRel });
      candidates.set(pascal, list);
      // Also register the "<Family><Sub>" concatenation (e.g. "FeedAd" for
      // feed family + ad sub) so top-level wrapper files that prefix the
      // family name still find their spec.
      if (slug !== fam.name) {
        const concat = `${familyPascal}${pascal}`;
        const concatList = candidates.get(concat) ?? [];
        concatList.push({ family: fam.name, slug, specRel });
        candidates.set(concat, concatList);
      }
    }
  }
  // Second pass: resolve each pascal key to a single spec, or skip it.
  const map = new Map();
  for (const [pascal, list] of candidates) {
    if (list.length === 1) {
      map.set(pascal, list[0].specRel);
      continue;
    }
    const familyRooted = list.filter((c) => c.family === c.slug);
    if (familyRooted.length === 1) {
      map.set(pascal, familyRooted[0].specRel);
    }
    // Otherwise ambiguous — leave it out.
  }
  return map;
}

// Map a top-level chorus file basename (PascalCase) to the chorus family
// it dispatches across. Used to inject JSDoc pointers into variant-
// wrapper files that don't reduce to a single spec.
async function buildBasenameFamilyMap() {
  const componentsRoot = resolve(repoRoot, "schema/components");
  const families = await readdir(componentsRoot, { withFileTypes: true });
  const map = new Map();
  for (const fam of families) {
    if (!fam.isDirectory()) continue;
    const famJsonPath = resolve(componentsRoot, fam.name, `${fam.name}.family.json`);
    let famJson;
    try {
      famJson = JSON.parse(await readFile(famJsonPath, "utf8"));
    } catch {
      continue;
    }
    // The family-wrapper file is named after the family's `name` (when set)
    // or the kebab→pascal of the family slug. Both Button.jsx (family
    // `button`, name "Button") and BottomSheet.jsx (`bottom-sheet`, "BottomSheet")
    // fall out of this mapping.
    const wrapperName = famJson.name ?? kebabToPascal(fam.name);
    map.set(wrapperName, {
      family: fam.name,
      subcomponents: famJson.subcomponents ?? [],
    });
  }
  return map;
}

// Render a JSDoc block for a family wrapper that lists each sub-component's
// variant slug + spec path. Designed so an AI editor reading the file
// learns which `variant` values exist and where to look up each one's prop
// contract.
function renderFamilyJsdoc(family, specPrefix) {
  const subs = family.subcomponents ?? [];
  if (subs.length === 0) return null;
  const lines = [
    `/**`,
    ` * ${family.family} family wrapper. Dispatches to a per-variant impl;`,
    ` * each variant's full prop contract lives in its own spec.`,
    ` *`,
  ];
  for (const sub of subs) {
    if (!sub?.spec) continue;
    const flag = sub.default ? " (default)" : "";
    lines.push(` * @see ${specPrefix}/${family.family}/${sub.spec} — variant="${sub.slug}"${flag}`);
  }
  lines.push(` */`);
  return lines.join("\n");
}

// Insert the JSDoc block immediately before the first `export function` /
// `export const`. Falls back to prepending at the end of the import block.
function injectFamilyJsdoc(source, jsdoc) {
  const exportRe = /^(?:export\s+(?:function|const|class|default)\b)/m;
  const m = exportRe.exec(source);
  if (m) {
    return source.slice(0, m.index) + jsdoc + "\n" + source.slice(m.index);
  }
  return source + "\n\n" + jsdoc + "\n";
}

function kebabToPascal(slug) {
  return slug
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join("");
}

// Map an HTML element name (from spec.element) to the matching TS DOM
// interface. Falls back to HTMLElement for anything not explicitly mapped.
function htmlElementToTsType(element) {
  if (!element || typeof element !== "string") return "HTMLElement";
  const map = {
    button: "HTMLButtonElement",
    a: "HTMLAnchorElement",
    input: "HTMLInputElement",
    textarea: "HTMLTextAreaElement",
    select: "HTMLSelectElement",
    label: "HTMLLabelElement",
    form: "HTMLFormElement",
    img: "HTMLImageElement",
    div: "HTMLDivElement",
    span: "HTMLSpanElement",
    p: "HTMLParagraphElement",
    h1: "HTMLHeadingElement",
    h2: "HTMLHeadingElement",
    h3: "HTMLHeadingElement",
    h4: "HTMLHeadingElement",
    h5: "HTMLHeadingElement",
    h6: "HTMLHeadingElement",
    ul: "HTMLUListElement",
    ol: "HTMLOListElement",
    li: "HTMLLIElement",
    nav: "HTMLElement",
    section: "HTMLElement",
    article: "HTMLElement",
    header: "HTMLElement",
    footer: "HTMLElement",
    main: "HTMLElement",
    aside: "HTMLElement",
    dialog: "HTMLDialogElement",
  };
  return map[element.toLowerCase()] ?? "HTMLElement";
}

// Convert a single spec.props.<name> entry to a TypeScript type expression.
// Spec prop type vocabulary (see schema/spec.schema.json): enum, literal,
// boolean, node, string, number, function, object. Both `enum` and `literal`
// carry a `values: [...]` array of allowed string values — render as a
// string-literal union so callers get autocomplete on the value set.
function specPropToTsType(prop) {
  switch (prop.type) {
    case "enum":
    case "literal":
      return Array.isArray(prop.values) && prop.values.length
        ? prop.values.map((v) => JSON.stringify(v)).join(" | ")
        : "string";
    case "boolean":
      return "boolean";
    case "node":
      return "React.ReactNode";
    case "string":
      return "string";
    case "number":
      return "number";
    case "function":
      // Callback shape isn't encoded in specs; widen to a general handler.
      // Common cases (onClick, onClose) accept zero or one event arg.
      return "(...args: any[]) => void";
    case "object":
      // Shapes are described in free-form prose (e.g. "{ label, onClick }").
      // Keep them open so callers can pass any object matching the prose.
      return "Record<string, any>";
    default:
      return "unknown";
  }
}

// Build a TypeScript interface declaration from a spec's props block.
// Optionality: a prop is optional if it declares `optional: true` OR carries
// a `default` (consumer doesn't have to pass it). The interface extends
// React.HTMLAttributes<E> so passthrough HTML props (className, style, aria-*,
// data-*, event handlers) remain typed.
function specToPropsInterface(spec, interfaceName, elementType, specRel) {
  const lines = [
    `/** Props for ${spec.name ?? interfaceName.replace(/Props$/, "")}${spec.subcomponent ? ` (${spec.subcomponent})` : ""}. Generated from schema/components/${specRel} — edit there, then re-run \`npm run build:lovable\`. */`,
    `export interface ${interfaceName} extends React.HTMLAttributes<${elementType}> {`,
  ];
  const props = spec.props ?? {};
  for (const [name, prop] of Object.entries(props)) {
    if (prop.description) {
      lines.push(`  /** ${prop.description.replace(/\*\//g, "*\\/")} */`);
    }
    const isOptional = prop.optional === true || prop.default !== undefined;
    const tsType = specPropToTsType(prop);
    const key = /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name);
    lines.push(`  ${key}${isOptional ? "?" : ""}: ${tsType};`);
  }
  // If any slot accepts text/node, expose `children`. Most chorus components
  // surface their primary slot via children.
  const slots = spec.slots ?? {};
  const hasNodeSlot = Object.values(slots).some(
    (s) => Array.isArray(s.accepts) && (s.accepts.includes("text") || s.accepts.includes("node")),
  );
  if (hasNodeSlot && !("children" in props)) {
    lines.push(`  children?: React.ReactNode;`);
  }
  lines.push(`}`);
  return lines.join("\n");
}

// Inject the generated Props interface near the top of the ported file and
// annotate the first `export function Foo({...})` (or `export function Foo({\n…})`)
// signature with `: <InterfaceName>`. If no such signature is found, the
// interface is still emitted as a standalone export — useful as a reference
// even if hover types don't land.
function injectPropsInterface(source, interfaceText, interfaceName) {
  // Inject AFTER the last import line so the interface lives in the file's
  // declaration zone, not above its own dependencies.
  const importLineRe = /^(?:import\b[^\n]*\n|export\s+\{[^}]*\}\s+from\s+[^\n]*\n)+/m;
  const lead = source.match(importLineRe);
  const insertion = `\n${interfaceText}\n`;
  let out;
  if (lead && lead.index === 0) {
    out = source.slice(0, lead[0].length) + insertion + source.slice(lead[0].length);
  } else {
    out = insertion + source;
  }
  // Annotate the destructured-arg `export function Name(\n  { … }\n)` so hover
  // resolves to the typed interface. Uses [\s\S]*? to span multi-line patterns.
  const fnRe = new RegExp(
    `(export\\s+function\\s+\\w+\\s*\\(\\s*\\{[\\s\\S]*?\\}\\s*)(\\))`,
    "m",
  );
  if (fnRe.test(out)) {
    out = out.replace(fnRe, `$1: ${interfaceName}$2`);
  }
  return out;
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
function rewriteSchemaSpecImports(source, specPrefix, referencedSpecs, fileSpecs) {
  return source.replace(
    /(from\s+['"]|import\(\s*['"])(?:\.\.\/)+schema\/components\/([^'"]+\.spec\.json)(['"])/g,
    (_match, lead, specRel, quote) => {
      if (referencedSpecs) referencedSpecs.add(specRel);
      if (fileSpecs) fileSpecs.add(specRel);
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
