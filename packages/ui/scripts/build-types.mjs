#!/usr/bin/env node
// Generate dist/index.d.ts (+ dist/icons/index.d.ts) from schema/components/**.
//
// The .jsx source has no TypeScript types, so tsup's `dts: true` cannot derive
// declarations. But every public prop, slot, element, and variant is already
// encoded in schema/components/<family>/<sub>.spec.json — the same files
// validators and the docs site read. This script turns those JSON contracts
// into a single hand-friendly .d.ts so consumers (Lovable, Cursor, IDE
// autocomplete) see `<FormField variant="search" placeholder="...">` instead
// of `ComponentType<any>`.
//
// Pipeline (one pass, no deps):
//   1. Read schema/manifest.json → enumerate families.
//   2. For each family, read <family>.family.json + each sub's <sub>.spec.json.
//   3. Group specs by their `name` (PascalCase React export). Same name = one
//      runtime export; multi-sub names (Button, FormField, NavigationBar,
//      Tabs, Chip, List) emit a discriminated union keyed on the literal
//      `variant` prop.
//   4. For each spec, mix in the React event-target attributes that match
//      its `element` (input → InputHTMLAttributes, button → button, …).
//      The spec lists what we own; native attributes (onChange, onBlur,
//      aria-*, etc.) come through the mixin so consumers don't have to
//      re-declare them.
//   5. Match against src/index.js' exports — anything exported without a
//      spec gets a permissive fallback so the type surface never regresses.
//   6. Write dist/index.d.ts (component types) and dist/icons/index.d.ts
//      (every icon is `({ size = 20, ...svgProps })`).

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");
const repoRoot = resolve(pkgRoot, "..", "..");

const schemaRoot = resolve(repoRoot, "schema");
const manifestPath = resolve(schemaRoot, "manifest.json");
const componentsDir = resolve(schemaRoot, "components");

const indexJsPath = resolve(pkgRoot, "src/index.js");
const iconsIndexPath = resolve(pkgRoot, "src/icons/index.js");

const distDir = resolve(pkgRoot, "dist");
const distIndexDts = resolve(distDir, "index.d.ts");
const distIconsDts = resolve(distDir, "icons/index.d.ts");

// ───────────────────────── helpers ─────────────────────────

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

/** Pull both `export { Foo } from './X';` and `export const Foo = ...` names. */
function extractExports(jsPath) {
  const src = readFileSync(jsPath, "utf8");
  const names = new Set();
  const reList = /export\s*\{\s*([^}]+)\s*\}/g;
  let m;
  while ((m = reList.exec(src)) !== null) {
    for (const tok of m[1].split(",")) {
      const name = tok.split(/\s+as\s+/)[0].trim();
      if (name) names.add(name);
    }
  }
  const reDecl = /export\s+(?:const|function|class)\s+([A-Za-z_$][\w$]*)/g;
  while ((m = reDecl.exec(src)) !== null) {
    names.add(m[1]);
  }
  return [...names];
}

/** React event-target attribute set per spec `element`. */
function nativeAttrType(element) {
  switch (element) {
    case "button":
      return "Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof SpecOwn>";
    case "input":
      return "Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof SpecOwn>";
    case "a":
      return "Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof SpecOwn>";
    case "span":
      return "Omit<React.HTMLAttributes<HTMLSpanElement>, keyof SpecOwn>";
    case "div":
    case "section":
    case "article":
    case "nav":
    case "ul":
    case "li":
    case "header":
    case "footer":
    default:
      return "Omit<React.HTMLAttributes<HTMLElement>, keyof SpecOwn>";
  }
}

/** Encode one spec `props.<key>` block as a TypeScript type expression. */
function propType(prop) {
  switch (prop.type) {
    case "literal":
      // Some specs (e.g. badge.size) declare `type: "literal"` but ship a
      // `values: [...]` array — treat that as an enum so the union surfaces.
      if (Array.isArray(prop.values)) {
        return prop.values.map((v) => JSON.stringify(v)).join(" | ");
      }
      return JSON.stringify(prop.value);
    case "enum":
      return prop.values.map((v) => JSON.stringify(v)).join(" | ");
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "node":
      return "React.ReactNode";
    case "function":
      // We don't model arg signatures yet — keep it permissive.
      return "(...args: any[]) => any";
    case "object":
      return "Record<string, unknown>";
    default:
      return "unknown";
  }
}

/** A prop is optional if the spec marks it so OR provides a default, OR
 * resolves to a single literal value (no real choice to make). Multi-value
 * literal-as-enum stays required unless explicitly marked. */
function isOptional(prop) {
  if (prop.optional === true || prop.default !== undefined) return true;
  if (prop.type === "literal" && !Array.isArray(prop.values)) return true;
  return false;
}

/** Render one spec into `interface <Name><Sub>Props extends NativeAttrs`. */
function renderSpecInterface(spec, ifaceName) {
  const ownLines = [];
  for (const [key, prop] of Object.entries(spec.props ?? {})) {
    const desc = prop.description ? `  /** ${prop.description.replace(/\*\//g, "* /")} */\n` : "";
    const safeKey = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
    const optMark = isOptional(prop) ? "?" : "";
    ownLines.push(`${desc}  ${safeKey}${optMark}: ${propType(prop)};`);
  }

  const native = nativeAttrType(spec.element);
  return [
    `interface ${ifaceName}Own {`,
    ownLines.join("\n") || "  /* no own props */",
    `}`,
    `export interface ${ifaceName} extends ${native.replace(/SpecOwn/g, `${ifaceName}Own`)}, ${ifaceName}Own {}`,
  ].join("\n");
}

// ───────────────────────── load + group ─────────────────────────

const manifest = readJson(manifestPath);
const exportsList = extractExports(indexJsPath);

/**
 * Build a map: `<ReactName>` → array of { spec, family, sub }.
 * Specs with the same React `name` collapse into one export
 * (and become a discriminated union if there are multiple subs).
 */
const exportMap = new Map();

for (const entry of manifest.components) {
  const family = entry.family;
  const familyDir = resolve(componentsDir, family);
  if (!existsSync(familyDir)) continue;

  const specFiles = readdirSync(familyDir).filter((f) => f.endsWith(".spec.json"));
  for (const file of specFiles) {
    const spec = readJson(resolve(familyDir, file));
    const name = spec.name;
    if (!name) continue;
    if (!exportMap.has(name)) exportMap.set(name, []);
    exportMap.get(name).push({ spec, family, sub: spec.subcomponent ?? null });
  }
}

// ───────────────────────── emit dist/index.d.ts ─────────────────────────

const lines = [];
lines.push(
  "// AUTO-GENERATED by packages/ui/scripts/build-types.mjs.",
  "// Source of truth: schema/components/<family>/<sub>.spec.json.",
  "// Do not edit by hand — re-run the script after spec changes.",
  "",
  'import * as React from "react";',
  "",
);

const seenInterfaces = new Set();
const exportDecls = [];

for (const [reactName, specs] of exportMap) {
  // Each spec → its own Props interface. Naming:
  //   single-spec family   → <ReactName>Props
  //   multi-sub same name  → <ReactName><PascalSub>Props, union → <ReactName>Props
  if (specs.length === 1) {
    const ifaceName = `${reactName}Props`;
    if (!seenInterfaces.has(ifaceName)) {
      lines.push(`// ── ${reactName} (${specs[0].family}${specs[0].sub ? `/${specs[0].sub}` : ""}) ──`);
      lines.push(renderSpecInterface(specs[0].spec, ifaceName));
      lines.push("");
      seenInterfaces.add(ifaceName);
    }
    exportDecls.push({ reactName, propsType: ifaceName });
  } else {
    const subIfaces = [];
    lines.push(`// ── ${reactName} (multi-sub: ${specs.map((s) => s.sub ?? "—").join(", ")}) ──`);
    for (const { spec, sub } of specs) {
      const subPascal = (sub ?? "default")
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("");
      const ifaceName = `${reactName}${subPascal}Props`;
      if (!seenInterfaces.has(ifaceName)) {
        lines.push(renderSpecInterface(spec, ifaceName));
        lines.push("");
        seenInterfaces.add(ifaceName);
      }
      subIfaces.push(ifaceName);
    }
    const unionName = `${reactName}Props`;
    lines.push(`export type ${unionName} =`);
    lines.push(subIfaces.map((s) => `  | ${s}`).join("\n") + ";");
    lines.push("");
    exportDecls.push({ reactName, propsType: unionName });
  }
}

// Exports listed in src/index.js but with no matching spec → permissive fallback.
const specBackedExports = new Set(exportDecls.map((e) => e.reactName));
const fallbackExports = exportsList.filter((n) => !specBackedExports.has(n));

if (fallbackExports.length > 0) {
  lines.push("// ── Exports without a spec ── (wrappers, groups; permissive types until specced)");
  for (const name of fallbackExports) {
    lines.push(
      `export interface ${name}Props extends React.HTMLAttributes<HTMLElement> { children?: React.ReactNode; [key: string]: unknown; }`,
    );
  }
  lines.push("");
}

// Concrete export declarations.
const allExports = [
  ...exportDecls,
  ...fallbackExports.map((name) => ({ reactName: name, propsType: `${name}Props` })),
];
for (const { reactName, propsType } of allExports) {
  lines.push(`export const ${reactName}: React.ForwardRefExoticComponent<${propsType} & React.RefAttributes<HTMLElement>>;`);
}

mkdirSync(distDir, { recursive: true });
writeFileSync(distIndexDts, lines.join("\n") + "\n");
console.log(`[build-types] dist/index.d.ts (${seenInterfaces.size} interfaces, ${allExports.length} exports)`);

// ───────────────────────── emit dist/icons/index.d.ts ─────────────────────────

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

mkdirSync(dirname(distIconsDts), { recursive: true });
writeFileSync(distIconsDts, iconLines.join("\n") + "\n");
console.log(`[build-types] dist/icons/index.d.ts (${iconExports.length} icons)`);
