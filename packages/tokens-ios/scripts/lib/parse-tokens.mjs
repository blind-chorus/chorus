// Shared token parser used by tokens-ios and tokens-android codegen.
// Reads the canonical resolved.*.json bundles from schema/tokens and
// returns a normalized shape that platform emitters can stitch into
// Swift / Kotlin source.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const tokensDir = resolve(here, "../../../../schema/tokens");

const px = (v) => {
  if (typeof v !== "string") return Number(v);
  const m = /^(-?\d*\.?\d+)px$/.exec(v.trim());
  if (!m) throw new Error(`expected px value, got: ${v}`);
  return Number(m[1]);
};

const camel = (segments) => {
  const joined = segments
    .map((s, i) =>
      i === 0
        ? s
        : s.charAt(0).toUpperCase() + s.slice(1)
    )
    .join("")
    .replace(/[^a-zA-Z0-9_]/g, "_");
  // Swift/Kotlin identifiers cannot start with a digit; prefix with `s`
  // (size). Used for tokens like `2xs`, `3xl`.
  return /^[0-9]/.test(joined) ? "s" + joined : joined;
};

const pascal = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const groupBy = (entries, prefix) =>
  entries
    .filter(([k]) => k.startsWith(prefix + "."))
    .map(([k, v]) => [k.slice(prefix.length + 1), v]);

const load = (file) => JSON.parse(readFileSync(resolve(tokensDir, file), "utf8"));

export function parseTokens() {
  const light = load("resolved.light.json");
  const dark = load("resolved.dark.json");

  const colorsLight = {};
  const colorsDark = {};
  for (const [key, def] of Object.entries(light)) {
    if (!key.startsWith("sys.color.")) continue;
    if (def.$type !== "color") continue;
    const sub = key.slice("sys.color.".length);
    if (sub.includes(".")) continue; // skip sys.color.placeholderImage.start, etc.
    colorsLight[sub] = def.$value;
  }
  for (const [key, def] of Object.entries(dark)) {
    if (!key.startsWith("sys.color.")) continue;
    if (def.$type !== "color") continue;
    const sub = key.slice("sys.color.".length);
    if (sub.includes(".")) continue;
    colorsDark[sub] = def.$value;
  }

  const dimension = (prefix) => {
    const out = {};
    for (const [k, def] of Object.entries(light)) {
      if (!k.startsWith(prefix + ".")) continue;
      const tail = k.slice(prefix.length + 1);
      if (tail.includes(".")) continue;
      if (typeof def.$value !== "string") continue;
      out[tail] = px(def.$value);
    }
    return out;
  };

  // sys.layout.{container,inline,stack,page}.{...} — kept nested
  const layout = { container: {}, inline: {}, stack: {}, page: {} };
  for (const [k, def] of Object.entries(light)) {
    const m = /^sys\.layout\.(container|inline|stack|page)\.([^.]+)$/.exec(k);
    if (!m) continue;
    layout[m[1]][m[2]] = px(def.$value);
  }

  const radius = dimension("sys.radius");
  const borderWidth = dimension("sys.borderWidth");
  const iconSize = dimension("sys.icon");

  const state = {};
  for (const [k, def] of Object.entries(light)) {
    if (!k.startsWith("sys.state.")) continue;
    const sub = k.slice("sys.state.".length);
    if (sub.includes(".")) continue;
    state[sub] = Number(def.$value);
  }

  // Composite typography: sys.typo.{role}.{size} where $value is { size, weight, line, tracking }
  const typography = {};
  for (const [k, def] of Object.entries(light)) {
    const m = /^sys\.typo\.([^.]+)\.([^.]+)$/.exec(k);
    if (!m) continue;
    if (typeof def.$value !== "object" || def.$value === null) continue;
    const [, role, size] = m;
    typography[role] ??= {};
    const v = def.$value;
    typography[role][size] = {
      size: px(v.size),
      weight: Number(v.weight),
      lineHeight: Number(v.line), // unitless multiplier
      tracking: typeof v.tracking === "string" ? v.tracking : String(v.tracking),
    };
  }

  // ref.palette.{family}.{step} — used by components that need a literal
  // translucent neutral that should adapt to surface (e.g., Chip tag).
  const palette = {};
  for (const [k, def] of Object.entries(light)) {
    const m = /^ref\.palette\.([^.]+)\.([^.]+)$/.exec(k);
    if (!m) continue;
    if (def.$type !== "color") continue;
    const [, family, step] = m;
    palette[family] ??= {};
    palette[family][step] = def.$value;
  }

  return {
    colorsLight,
    colorsDark,
    layout,
    radius,
    borderWidth,
    iconSize,
    state,
    typography,
    palette,
  };
}

/**
 * Decode a CSS hex literal (#rgb / #rrggbb / #rrggbbaa) into 0-255 channels.
 * Used by every platform emitter; each formats the channels in its own
 * conventions (Swift Color(.sRGB,...), Compose Color(0xAARRGGBB), ...).
 */
export function parseHex(hex) {
  const h = hex.replace("#", "").toLowerCase();
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
      a: 255,
    };
  }
  if (h.length === 6 || h.length === 8) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) : 255,
    };
  }
  throw new Error(`unsupported color literal: ${hex}`);
}

export { camel, pascal };
