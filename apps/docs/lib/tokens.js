import reference from '@blind-dsai/tokens/reference.json';
import system from '@blind-dsai/tokens/system.json';
import component from '@blind-dsai/tokens/component.json';

const BREAKPOINTS = {
  web: '800px',
};

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

let _cachedTokens = null;
export function loadTokens() {
  if (_cachedTokens) return _cachedTokens;
  const flat = {
    ...flatten(reference),
    ...flatten(system),
    ...flatten(component),
  };
  const cache = new Map();

  function resolveRef(path) {
    if (cache.has(path)) return cache.get(path);
    const target = flat[path];
    if (!target) {
      console.warn('Unresolved token reference:', path);
      return null;
    }
    const r = resolve(target.$value);
    cache.set(path, r);
    return r;
  }

  function resolve(val) {
    if (typeof val !== 'string') return val;
    const whole = val.match(/^\{(.+)\}$/);
    if (whole) {
      const r = resolveRef(whole[1]);
      return r == null ? val : r;
    }
    if (val.includes('{')) {
      return val.replace(/\{([^}]+)\}/g, (_, path) => {
        const r = resolveRef(path);
        return r == null ? `{${path}}` : r;
      });
    }
    return val;
  }

  function refOf(val) {
    if (typeof val !== 'string') return null;
    const m = val.match(/^\{(.+)\}$/);
    return m ? m[1] : null;
  }

  function resolveVariant(variant) {
    const values = {};
    const refs = {};
    for (const [k, v] of Object.entries(variant)) {
      values[k] = resolve(v);
      refs[k] = refOf(v);
    }
    return { values, refs };
  }

  const resolved = {};
  for (const [path, token] of Object.entries(flat)) {
    const out = {
      ...token,
      $value: resolve(token.$value),
      $valueRef: refOf(token.$value),
    };
    if (token.$responsive) {
      const { values, refs } = resolveVariant(token.$responsive);
      out.$responsive = values;
      out.$responsiveRef = refs;
    }
    if (token.$theme) {
      const { values, refs } = resolveVariant(token.$theme);
      out.$theme = values;
      out.$themeRef = refs;
    }
    resolved[path] = out;
  }
  _cachedTokens = resolved;
  return resolved;
}

export function toCssVarName(path) {
  return '--' + path.replace(/\./g, '-');
}

export function tokensAsCss(tokens) {
  const baseLines = [];
  const bpLines = {};
  /* Mobile-pin lines mirror the responsive token names but carry the
     base (mobile) `$value` instead of the breakpoint override. They
     are emitted inside each `@media` block under
     `.component-preview-stage`, so any token that grows on web is
     re-pinned to its mobile value within the preview frame subtree —
     the previews are mobile-surface specimens and the surrounding
     desktop docs chrome should not inflate their padding / gaps.
     Outside the @media block these declarations are not needed (the
     mobile values are already the cascade default). */
  const mobilePinLines = {};
  const themeLines = {};

  for (const [path, token] of Object.entries(tokens)) {
    const v = token.$value;
    if (typeof v === 'string' || typeof v === 'number') {
      baseLines.push(`  ${toCssVarName(path)}: ${v};`);
    }
    if (token.$responsive) {
      for (const [bp, val] of Object.entries(token.$responsive)) {
        if (typeof val === 'string' || typeof val === 'number') {
          (bpLines[bp] ||= []).push(`    ${toCssVarName(path)}: ${val};`);
          if (typeof v === 'string' || typeof v === 'number') {
            (mobilePinLines[bp] ||= []).push(`    ${toCssVarName(path)}: ${v};`);
          }
        }
      }
    }
    if (token.$theme) {
      for (const [theme, val] of Object.entries(token.$theme)) {
        if (typeof val === 'string' || typeof val === 'number') {
          (themeLines[theme] ||= []).push(`  ${toCssVarName(path)}: ${val};`);
        }
      }
    }
  }

  let out = `:root {\n${baseLines.join('\n')}\n}`;
  // Selector is unqualified so any subtree with `data-theme` (e.g. a preview
  // stage that overrides the global theme) inherits the right palette.
  // Light is the base set, but we re-emit it under `[data-theme="light"]`
  // so a subtree can flip back to light when the page is in dark mode —
  // without this rule the subtree would inherit the surrounding dark vars.
  out += `\n\n[data-theme="light"] {\n${baseLines.join('\n')}\n}`;
  for (const [theme, lines] of Object.entries(themeLines)) {
    out += `\n\n[data-theme="${theme}"] {\n${lines.join('\n')}\n}`;
  }
  for (const [bp, lines] of Object.entries(bpLines)) {
    const minWidth = BREAKPOINTS[bp];
    if (!minWidth) continue;
    // Mirror the responsive overrides under `[data-theme="light"]` (and any
    // other theme that re-declares the base set). Without this, a subtree
    // that pins itself to a theme — e.g. a preview stage — would inherit the
    // mobile base values from `[data-theme="light"]` even on a desktop
    // viewport, while a sibling stage with no override picks up the @media
    // `:root` values. The visible bug: light-themed previews shrank vs. the
    // dark/match-site previews on web.
    const themeOverrides = ['  [data-theme="light"] {', ...lines, '  }'];
    /* Preview stages render mobile-surface specimens, so inside the
       @media web override we re-pin every responsive token to its
       mobile base value on `.component-preview-stage`. Subtree
       inheritance does the rest: components inside the stage resolve
       the same `var(--sys-…)` calls to mobile numbers even when the
       surrounding docs chrome uses the inflated web values. */
    const previewPin = mobilePinLines[bp]
      ? ['  .component-preview-stage,', '  .component-preview-stage [data-theme="light"] {', ...mobilePinLines[bp], '  }']
      : [];
    out += `\n\n@media (min-width: ${minWidth}) {\n  :root {\n${lines.join('\n')}\n  }\n${themeOverrides.join('\n')}\n${previewPin.join('\n')}\n}`;
  }
  return out;
}

export function groupByPrefix(tokens, prefix) {
  const result = {};
  for (const [path, token] of Object.entries(tokens)) {
    if (path.startsWith(prefix + '.')) {
      result[path.slice(prefix.length + 1)] = token;
    }
  }
  return result;
}
