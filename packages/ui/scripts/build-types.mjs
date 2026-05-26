#!/usr/bin/env node
// Generate dist/index.d.ts + dist/index.d.cts (+ dist/icons/* counterparts)
// from schema/components/**.
//
// The .jsx source has no TypeScript types, so tsup's `dts: true` cannot derive
// declarations. Every public prop, slot, element, and variant is already
// encoded in schema/components/<family>/<sub>.spec.json — the same files
// validators read. This script turns those JSON contracts into a typed
// surface so consumers (Lovable, Cursor, IDE autocomplete) see
// `<FormField variant="search" placeholder="…">` instead of
// `ComponentType<any>`.
//
// Pipeline:
//   1. Reuse loadManifest / loadFamily from schema/lint/validate-screen.mjs so
//      the family walk shares one source of truth with the validators and
//      respects family.json's authoritative `subcomponents[]` (no readdirSync,
//      no risk of picking up a spec that family.json deliberately omits).
//   2. Group specs by `name`. Same name = one runtime export; multi-sub names
//      (Button, FormField, NavigationBar, Tabs, Chip, List) emit a
//      discriminated union keyed on the literal `variant`. The default sub's
//      `variant` is omittable; every other sub's `variant` is required so TS
//      narrows the union.
//   3. Per spec, mix in the React event-target attributes for its `element`
//      and thread the matching DOM type through `RefAttributes<>` so `ref`
//      typing survives.
//   4. Emit both `.d.ts` (ESM) and `.d.cts` (CJS under moduleResolution
//      node16/bundler) — same content, paired with the package.json `exports`
//      conditions.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { readJson } from "../../../schema/lint/utils.mjs";
import { loadManifest, loadFamily } from "../../../schema/lint/validate-screen.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");

const indexJsPath = resolve(pkgRoot, "src/index.js");
const iconsIndexPath = resolve(pkgRoot, "src/icons/index.js");
const distDir = resolve(pkgRoot, "dist");

// ───────────────────────── helpers ─────────────────────────

/** Parse `export { Foo } from './X'` and `export const Foo = …` from a JS
 *  module's text into a name list. Warns on `export default` / `export *`
 *  so future drift is loud (today neither pattern appears in src/index.js or
 *  src/icons/index.js — adding one would silently shrink the typed surface). */
function extractExports(jsPath) {
  const text = readFileSync(jsPath, "utf8");

  if (/export\s+(default|\*)/.test(text)) {
    console.warn(
      `[build-types] ${jsPath}: 'export default' / 'export *' detected — ` +
        `not parsed; the typed surface may be incomplete.`,
    );
  }

  const names = new Set();
  const reList = /export\s*\{\s*([^}]+)\s*\}/g;
  let m;
  while ((m = reList.exec(text)) !== null) {
    for (const tok of m[1].split(",")) {
      const name = tok.split(/\s+as\s+/)[0].trim();
      if (name) names.add(name);
    }
  }
  const reDecl = /export\s+(?:const|function|class)\s+([A-Za-z_$][\w$]*)/g;
  while ((m = reDecl.exec(text)) !== null) {
    names.add(m[1]);
  }
  return [...names];
}

/** spec.element → DOM lib type. Threaded into both the prop-attr mixin and
 *  `RefAttributes<>` so a typed `ref` survives. */
function elementToDomType(element) {
  switch (element) {
    case "button": return "HTMLButtonElement";
    case "input": return "HTMLInputElement";
    case "a": return "HTMLAnchorElement";
    case "span": return "HTMLSpanElement";
    case "ul": return "HTMLUListElement";
    case "li": return "HTMLLIElement";
    case "div": return "HTMLDivElement";
    default: return "HTMLElement";
  }
}

/** spec.element → React.*HTMLAttributes<DomType>. */
function elementAttrsType(element) {
  const dom = elementToDomType(element);
  switch (element) {
    case "button": return `React.ButtonHTMLAttributes<${dom}>`;
    case "input": return `React.InputHTMLAttributes<${dom}>`;
    case "a": return `React.AnchorHTMLAttributes<${dom}>`;
    default: return `React.HTMLAttributes<${dom}>`;
  }
}

/** Encode one spec `props.<key>` block as a TS type expression. */
function propType(prop) {
  switch (prop.type) {
    case "literal":
      // Some specs (badge.size) declare `type:"literal"` but ship `values:[…]`
      // — treat that as enum so the union surfaces.
      if (Array.isArray(prop.values)) {
        return prop.values.map((v) => JSON.stringify(v)).join(" | ");
      }
      return JSON.stringify(prop.value);
    case "enum":
      return prop.values.map((v) => JSON.stringify(v)).join(" | ");
    case "string": return "string";
    case "number": return "number";
    case "boolean": return "boolean";
    case "node": return "React.ReactNode";
    case "function": return "(...args: any[]) => any";
    case "object": return "Record<string, unknown>";
    default: return "unknown";
  }
}

function isOptional(prop) {
  if (prop.optional === true || prop.default !== undefined) return true;
  if (prop.type === "literal" && !Array.isArray(prop.values)) return true;
  return false;
}

/** Render one spec into `interface <Iface>Own { … }` + `export interface
 *  <Iface> extends Omit<NativeAttrs, keyof Own>, Own {}`.
 *
 *  In a discriminated union (multi-sub family), the `variant` literal must be
 *  required on non-default subs so TS can narrow; the default sub keeps it
 *  optional because the runtime defaults it. */
function renderSpecInterface(spec, ifaceName, { isDefaultSub, isInUnion }) {
  const ownName = `${ifaceName}Own`;
  const ownLines = [];
  for (const [key, prop] of Object.entries(spec.props ?? {})) {
    const desc = prop.description
      ? `  /** ${prop.description.replace(/\*\//g, "* /")} */\n`
      : "";
    const safeKey = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);

    let optional = isOptional(prop);
    if (isInUnion && key === "variant") {
      optional = isDefaultSub;
    }

    ownLines.push(`${desc}  ${safeKey}${optional ? "?" : ""}: ${propType(prop)};`);
  }
  const attrs = elementAttrsType(spec.element);
  return [
    `interface ${ownName} {`,
    ownLines.join("\n") || "  /* no own props */",
    `}`,
    `export interface ${ifaceName} extends Omit<${attrs}, keyof ${ownName}>, ${ownName} {}`,
  ].join("\n");
}

/** Pick the ref/DOM type for an export. Single-spec: that spec's element.
 *  Multi-sub union: the common DOM type if all subs agree, else HTMLElement. */
function pickRefDomType(specs) {
  const doms = new Set(specs.map((s) => elementToDomType(s.spec.element)));
  return doms.size === 1 ? [...doms][0] : "HTMLElement";
}

/** spec.exportAlias may be a single string or an array; always iterate. */
function normalizeAlias(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

// ───────────────────────── load + group ─────────────────────────

const manifest = loadManifest();

/** Map<ReactName, Array<{ spec, family, sub: { slug, default } }>>. */
const exportMap = new Map();

for (const entry of manifest.components) {
  const fam = loadFamily(manifest, entry.family);
  if (!fam) continue;
  for (const subEntry of fam.family.subcomponents ?? []) {
    if (subEntry.specMissing || !subEntry.spec) continue;
    const spec = readJson(resolve(fam.dir, subEntry.spec));
    const name = spec.name;
    if (!name) continue;
    if (!exportMap.has(name)) exportMap.set(name, []);
    exportMap.get(name).push({
      spec,
      family: entry.family,
      sub: { slug: subEntry.slug, default: subEntry.default === true },
    });
  }
}

// ───────────────────────── emit ─────────────────────────

const exportsList = extractExports(indexJsPath);

const lines = [
  "// AUTO-GENERATED by packages/ui/scripts/build-types.mjs.",
  "// Source of truth: schema/components/<family>/<sub>.spec.json.",
  "// Do not edit by hand — re-run the script after spec changes.",
  "",
  'import * as React from "react";',
  "",
];

const seenInterfaces = new Set();
const exportDecls = [];
/** Aliases declared via spec.exportAlias — extra export names pointing at the
 *  same props type as their source spec. Collected during the main loop and
 *  emitted at the end so they sit visually below the canonical exports. */
const aliasEntries = []; // { aliasName, sourcePropsType, refDom }

for (const [reactName, specs] of exportMap) {
  const refDom = pickRefDomType(specs);

  if (specs.length === 1) {
    const ifaceName = `${reactName}Props`;
    if (!seenInterfaces.has(ifaceName)) {
      lines.push(`// ── ${reactName} (${specs[0].family}${specs[0].sub.slug ? `/${specs[0].sub.slug}` : ""}) ──`);
      lines.push(renderSpecInterface(specs[0].spec, ifaceName, { isDefaultSub: true, isInUnion: false }));
      lines.push("");
      seenInterfaces.add(ifaceName);
    }
    exportDecls.push({ reactName, propsType: ifaceName, refDom });
    for (const alias of normalizeAlias(specs[0].spec.exportAlias)) {
      aliasEntries.push({ aliasName: alias, sourcePropsType: ifaceName, refDom });
    }
  } else {
    const subIfaces = [];
    lines.push(`// ── ${reactName} (multi-sub: ${specs.map((s) => s.sub.slug ?? "—").join(", ")}) ──`);
    for (const { spec, sub } of specs) {
      const subPascal = (sub.slug ?? "default")
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("");
      const ifaceName = `${reactName}${subPascal}Props`;
      if (!seenInterfaces.has(ifaceName)) {
        lines.push(renderSpecInterface(spec, ifaceName, {
          isDefaultSub: sub.default,
          isInUnion: true,
        }));
        lines.push("");
        seenInterfaces.add(ifaceName);
      }
      subIfaces.push(ifaceName);
      for (const alias of normalizeAlias(spec.exportAlias)) {
        aliasEntries.push({
          aliasName: alias,
          sourcePropsType: ifaceName,
          refDom: elementToDomType(spec.element),
        });
      }
    }
    const unionName = `${reactName}Props`;
    lines.push(`export type ${unionName} =`);
    lines.push(subIfaces.map((s) => `  | ${s}`).join("\n") + ";");
    lines.push("");
    exportDecls.push({ reactName, propsType: unionName, refDom });
  }
}

// src/index.js exports without a spec OR an alias declaration → permissive
// fallback (FormFieldGroup, FeedGroup, Tab — wrappers/groups that don't have
// their own spec yet). Alias names are spec-backed via spec.exportAlias and
// stay out of the fallback bucket so their typed surface survives.
const specBackedExports = new Set([
  ...exportDecls.map((e) => e.reactName),
  ...aliasEntries.map((a) => a.aliasName),
]);
const fallbackExports = exportsList.filter((n) => !specBackedExports.has(n));

if (fallbackExports.length > 0) {
  lines.push("// ── Exports without a spec ── (wrappers/groups; permissive until specced)");
  for (const name of fallbackExports) {
    lines.push(
      `export interface ${name}Props extends React.HTMLAttributes<HTMLElement> { children?: React.ReactNode; [key: string]: unknown; }`,
    );
  }
  lines.push("");
}

const allExports = [
  ...exportDecls,
  ...fallbackExports.map((name) => ({ reactName: name, propsType: `${name}Props`, refDom: "HTMLElement" })),
];
for (const { reactName, propsType, refDom } of allExports) {
  lines.push(`export const ${reactName}: React.ForwardRefExoticComponent<${propsType} & React.RefAttributes<${refDom}>>;`);
}

if (aliasEntries.length > 0) {
  lines.push("");
  lines.push("// ── Aliases ── (additional export names declared via spec.exportAlias).");
  lines.push("// Each alias drops the `variant` discriminator — the runtime wrapper locks it,");
  lines.push("// so consumers don't need to repeat the variant in JSX.");
  for (const { aliasName, sourcePropsType, refDom } of aliasEntries) {
    lines.push(`export type ${aliasName}Props = Omit<${sourcePropsType}, "variant">;`);
    lines.push(`export const ${aliasName}: React.ForwardRefExoticComponent<${aliasName}Props & React.RefAttributes<${refDom}>>;`);
  }
}

const indexOut = lines.join("\n") + "\n";
mkdirSync(distDir, { recursive: true });
writeFileSync(resolve(distDir, "index.d.ts"), indexOut);
writeFileSync(resolve(distDir, "index.d.cts"), indexOut);
console.log(`[build-types] dist/index.d.{ts,cts} (${seenInterfaces.size} interfaces, ${allExports.length} exports)`);

// ───────────────────────── icons ─────────────────────────

const iconExports = extractExports(iconsIndexPath);
const iconLines = [
  "// AUTO-GENERATED by packages/ui/scripts/build-types.mjs.",
  "",
  'import * as React from "react";',
  "",
  "export interface IconProps extends React.SVGAttributes<SVGSVGElement> {",
  "  /** Pixel size of the rendered square SVG. Default: 20. */",
  "  size?: number;",
  "}",
  "",
  "export type IconComponent = React.FC<IconProps> & { keywords?: string[]; displayName?: string };",
  "",
];
for (const name of iconExports) {
  iconLines.push(`export const ${name}: IconComponent;`);
}

const iconOut = iconLines.join("\n") + "\n";
const iconsDir = resolve(distDir, "icons");
mkdirSync(iconsDir, { recursive: true });
writeFileSync(resolve(iconsDir, "index.d.ts"), iconOut);
writeFileSync(resolve(iconsDir, "index.d.cts"), iconOut);
console.log(`[build-types] dist/icons/index.d.{ts,cts} (${iconExports.length} icons)`);
