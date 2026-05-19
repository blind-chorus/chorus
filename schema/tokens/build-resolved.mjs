#!/usr/bin/env node
/**
 * Build dereferenced token bundles for external consumers.
 *
 * Reads the three-tier token sources (reference.json + system.json + component.json)
 * and writes flat path → concrete-value JSON bundles:
 *
 *   schema/tokens/resolved.light.json
 *   schema/tokens/resolved.dark.json
 *   schema/tokens/resolved.web.json       (web-breakpoint overrides, light theme; sparse)
 *   schema/tokens/resolved.web.dark.json  (web-breakpoint overrides, dark theme; sparse)
 *
 * External tools (Claude Design, AI agents, design plugins) read these instead of
 * the source three-tier files — they don't have to know about `{ref.palette.blue.500}`
 * dereferencing or the `$theme.dark` / `$responsive.web` overlay model.
 *
 * Run via `npm run build:tokens` from the repo root.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(readFileSync(resolve(here, f), 'utf8'));

const reference = read('reference.json');
const system    = read('system.json');
const component = read('component.json');

function flatten(obj, prefix = '') {
  const out = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      out[path] = val;
    } else if (val && typeof val === 'object') {
      Object.assign(out, flatten(val, path));
    }
  }
  return out;
}

const flat = { ...flatten(reference), ...flatten(system), ...flatten(component) };
const cache = new Map();

function resolveRef(path, visiting = new Set()) {
  const key = path;
  if (cache.has(key)) return cache.get(key);
  if (visiting.has(path)) throw new Error(`Token cycle through ${path}`);
  visiting.add(path);
  const target = flat[path];
  if (!target) {
    console.warn(`[build-resolved] unresolved reference: ${path}`);
    return null;
  }
  const r = resolveValue(target.$value, visiting);
  cache.set(key, r);
  return r;
}

function resolveValue(val, visiting = new Set()) {
  if (typeof val !== 'string') return val;
  const whole = val.match(/^\{(.+)\}$/);
  if (whole) {
    const r = resolveRef(whole[1], visiting);
    return r == null ? val : r;
  }
  if (val.includes('{')) {
    return val.replace(/\{([^}]+)\}/g, (_, p) => {
      const r = resolveRef(p, new Set(visiting));
      return r == null ? `{${p}}` : r;
    });
  }
  return val;
}

function pickThemeValue(token, theme) {
  if (theme === 'light') return token.$value;
  if (token.$theme && token.$theme[theme] !== undefined) return token.$theme[theme];
  return token.$value;
}

function buildBundle({ theme, breakpoint }) {
  const out = {};
  for (const [path, token] of Object.entries(flat)) {
    let raw;
    if (breakpoint) {
      if (!token.$responsive || token.$responsive[breakpoint] === undefined) continue;
      raw = token.$responsive[breakpoint];
    } else {
      raw = pickThemeValue(token, theme);
    }
    const resolved = resolveValue(raw);
    out[path] = {
      $value: resolved,
      $type: token.$type,
    };
  }
  // Synthesize composite `sys.typo.<role>.<rung>` entries. The spec binding
  // tier names typography by role (`sys.typo.label.md`), expecting a consumer
  // to read size + weight + line + tracking together, but the source tier only
  // stores the four leaves separately. Emit an aggregate so external renderers
  // can look up the role name directly.
  for (const role of ['display', 'heading', 'body', 'label', 'caption']) {
    for (const rung of ['lg', 'md', 'sm']) {
      const base = `sys.typo.${role}.${rung}`;
      const leaves = ['size', 'weight', 'line', 'tracking'];
      const value = {};
      let any = false;
      for (const leaf of leaves) {
        const entry = out[`${base}.${leaf}`];
        if (entry) { value[leaf] = entry.$value; any = true; }
      }
      if (any && !breakpoint) out[base] = { $value: value, $type: 'typography' };
      if (any && breakpoint) {
        // Only emit web composite when at least one leaf is in the web overlay.
        const hasOverlay = leaves.some(l => out[`${base}.${l}`]);
        if (hasOverlay) out[base] = { $value: value, $type: 'typography' };
      }
    }
  }
  return out;
}

function write(name, data) {
  const file = resolve(here, name);
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`[build-resolved] wrote ${name} (${Object.keys(data).length} tokens)`);
}

const light    = buildBundle({ theme: 'light' });
const dark     = buildBundle({ theme: 'dark' });
const webLight = buildBundle({ theme: 'light', breakpoint: 'web' });
const webDark  = buildBundle({ theme: 'dark',  breakpoint: 'web' });

write('resolved.light.json',    light);
write('resolved.dark.json',     dark);
write('resolved.web.json',      webLight);
write('resolved.web.dark.json', webDark);

// ---------------------------------------------------------------------------
// CSS emit — `tokens.css` mirrors the docs runtime emission (apps/docs/lib/
// tokens.js): `:root` carries light, `[data-theme="dark"]` overrides for dark,
// and a `@media` block holds web-breakpoint overrides under both `:root` and
// `[data-theme="light"]` so a light-pinned subtree still picks up the web
// values. Typography composites (`$type: 'typography'`) are skipped — their
// `.size`/`.weight`/`.line`/`.tracking` leaves emit individually.
// ---------------------------------------------------------------------------

const WEB_BREAKPOINT = '800px';
const toCssVarName = (path) => '--' + path.replace(/\./g, '-');

function emitLines(bundle, indent = '  ', base = null) {
  const lines = [];
  for (const [path, token] of Object.entries(bundle)) {
    const v = token.$value;
    if (typeof v !== 'string' && typeof v !== 'number') continue;
    if (base && base[path]?.$value === v) continue;
    lines.push(`${indent}${toCssVarName(path)}: ${v};`);
  }
  return lines;
}

const block = (selector, lines) => {
  if (!lines.length) return '';
  const pad = selector.match(/^ */)[0];
  return `${selector} {\n${lines.join('\n')}\n${pad}}`;
};

const lightLines   = emitLines(light);
const darkLines    = emitLines(dark, '  ', light);
const webLines     = emitLines(webLight, '    ', light);
const webDarkLines = emitLines(webDark,  '    ', dark);

const parts = [
  '/* Chorus design tokens — generated by schema/tokens/build-resolved.mjs.\n' +
  '   Import once at your app entry: `import "@blind-dsai/tokens/tokens.css";`\n' +
  '   Toggle dark mode by setting `data-theme="dark"` on <html> or any ancestor. */',
  block(':root', lightLines),
  block('[data-theme="light"]', lightLines),
  block('[data-theme="dark"]', darkLines),
];

if (webLines.length) {
  const inner = [
    block('  :root', webLines),
    block('  [data-theme="light"]', webLines),
    block('  [data-theme="dark"]', webDarkLines),
  ].filter(Boolean).join('\n');
  parts.push(`@media (min-width: ${WEB_BREAKPOINT}) {\n${inner}\n}`);
}

const cssOut = parts.filter(Boolean).join('\n\n') + '\n';
writeFileSync(resolve(here, 'tokens.css'), cssOut);
console.log(`[build-resolved] wrote tokens.css (${cssOut.split('\n').length} lines)`);
