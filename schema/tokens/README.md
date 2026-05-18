# @blind-chorus/tokens

Design tokens for the Chorus design system. Ships the three-tier source JSON (`reference` → `system` → `component`), dereferenced `resolved.*.json` bundles for non-CSS consumers, and a single `tokens.css` that emits every token as a CSS custom property.

The token *meaning* — what each role is for, how the tiers compose, why the values are what they are — lives in [`schema/DESIGN.md`](https://github.com/blind-chorus/chorus/blob/main/schema/DESIGN.md) in the Chorus monorepo. This package ships values only.

> **License:** UNLICENSED (proprietary).

## Install

```bash
npm install @blind-chorus/tokens
```

## Use the CSS bundle (most common)

Import once at your app entry:

```js
import '@blind-chorus/tokens/tokens.css';
```

This emits:

- `:root { … }` — every token as `--ref-*` / `--sys-*` / `--comp-*` custom properties (light theme).
- `[data-theme="light"] { … }` — same set, so a subtree can flip back to light when the page is dark.
- `[data-theme="dark"] { … }` — dark-mode overrides only (diff vs. light).
- `@media (min-width: 800px) { … }` — web-breakpoint overrides for responsive tokens (typography sizes, layout spacing).

Toggle dark mode by setting `data-theme="dark"` on `<html>` or any ancestor.

```css
.button {
  background: var(--sys-color-primary);
  color: var(--sys-color-onPrimary);
  padding: var(--sys-layout-container-md);
  border-radius: var(--sys-radius-md);
}
```

## Use the JSON bundles (Figma plugin, AI agents, native renderers)

```js
import light from '@blind-chorus/tokens/resolved.light.json';
import dark  from '@blind-chorus/tokens/resolved.dark.json';
```

Each entry is `{ "<dotted.path>": { "$value": …, "$type": … } }` with all references already dereferenced. Web-breakpoint overrides are in the sparse `resolved.web.json` / `resolved.web.dark.json` bundles.

## Use the three-tier source (advanced)

```js
import reference from '@blind-chorus/tokens/reference.json';
import system    from '@blind-chorus/tokens/system.json';
import component from '@blind-chorus/tokens/component.json';
```

Values may be DTCG-style references (`"{ref.palette.blue.500}"`); you resolve them yourself. Use this only if you need the source structure (e.g. to retheme by swapping the reference tier).

## Rebuilding

From the repo root:

```bash
npm run build:tokens
```

Regenerates every `resolved.*.json` and `tokens.css`. The source of truth is the three `.json` files in this directory.
