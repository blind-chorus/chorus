# @blind-dsai/tokens

Design tokens for Chorus. Ships three-tier source JSON (`reference` → `system` → `component`), dereferenced `resolved.*.json` bundles for non-CSS consumers, and `tokens.css` emitting every token as a CSS custom property.

Token *meaning* lives in [`schema/DESIGN.md`](https://github.com/blind-dsai/chorus/blob/main/schema/DESIGN.md). This package ships values only.

> **License:** MIT. See [`LICENSE`](../../LICENSE).

## Install

See [`CONSUMING.md`](../../CONSUMING.md) for install + usage from external projects.

```bash
npm install @blind-dsai/tokens
```

## CSS bundle (most common)

```js
import '@blind-dsai/tokens/tokens.css';
```

Emits:

- `:root { … }` — every token as `--ref-*` / `--sys-*` / `--comp-*` (light theme).
- `[data-theme="light"] { … }` — same set, so a subtree can flip back to light.
- `[data-theme="dark"] { … }` — dark-mode overrides only (diff vs. light).
- `@media (min-width: 800px) { … }` — web-breakpoint overrides (typo sizes, layout spacing).

Toggle dark mode: `data-theme="dark"` on `<html>` or any ancestor.

```css
.button {
  background: var(--sys-color-primary);
  color: var(--sys-color-onPrimary);
  padding: var(--sys-layout-container-md);
  border-radius: var(--sys-radius-md);
}
```

## JSON bundles (AI agents, design tools, native renderers)

```js
import light from '@blind-dsai/tokens/resolved.light.json';
import dark  from '@blind-dsai/tokens/resolved.dark.json';
```

Each entry: `{ "<dotted.path>": { "$value": …, "$type": … } }`, fully dereferenced. Web-breakpoint overrides in sparse `resolved.web.json` / `resolved.web.dark.json`.

## Three-tier source (advanced)

```js
import reference from '@blind-dsai/tokens/reference.json';
import system    from '@blind-dsai/tokens/system.json';
import component from '@blind-dsai/tokens/component.json';
```

Values may be DTCG-style references (`"{ref.palette.blue.500}"`); resolve yourself. Use only if you need source structure (e.g. retheme by swapping the reference tier).

## Rebuilding

From repo root:

```bash
npm run build:tokens
```

Regenerates every `resolved.*.json` and `tokens.css`. Source of truth: the three `.json` files in this directory.
