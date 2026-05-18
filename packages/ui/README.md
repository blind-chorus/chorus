# @blind-chorus/ui

React component library for the Chorus design system. Source-distributed — the package ships raw `.jsx` files and a single `styles.css`; your bundler compiles the JSX, your app loads the stylesheet once.

The component contract (anatomy, slots, token bindings) lives in `schema/components/<family>/<sub>.spec.json` in the [Chorus monorepo](https://github.com/blind-chorus/chorus). This package is the React reference implementation of that contract.

> **License:** UNLICENSED (proprietary). Distribution is restricted; see the repo for terms.

## Install

```bash
npm install @blind-chorus/ui @blind-chorus/tokens
```

Peer dependency: `react >= 18`.

## Setup

Two stylesheets and one font, loaded once at your app entry.

```js
// app entry (e.g. Next.js app/layout.tsx, Vite main.tsx)
import '@blind-chorus/tokens/tokens.css';
import '@blind-chorus/ui/styles.css';
```

Then load Pretendard — the only typeface Chorus speaks. The CDN drop-in works in most setups:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

### Dark mode

Tokens flip on the `data-theme` attribute. Set it on `<html>` (or any subtree):

```html
<html data-theme="dark">
```

No-script default is light; set the attribute server-side or in an inline `<script>` before paint to avoid a flash.

## Usage

```jsx
import { Button, Chip, Callout } from '@blind-chorus/ui';

export default function Example() {
  return (
    <>
      <Button variant="standard" appearance="filled">Save</Button>
      <Chip appearance="assist">Filter</Chip>
      <Callout tone="info">Heads up.</Callout>
    </>
  );
}
```

Component-level props (`variant`, `appearance`, `size`, slots) follow the per-component spec in `schema/components/`. The docs site renders these specs as the authoritative reference.

## Bundler configuration

Because the package ships `.jsx` source rather than a prebuilt bundle, your toolchain must transpile it.

- **Next.js** — add to `next.config.js`:
  ```js
  module.exports = { transpilePackages: ['@blind-chorus/ui'] };
  ```
- **Vite / esbuild / Rollup** — JSX inside `node_modules` works out of the box in most setups; if you've narrowed the include list, extend it to include `@blind-chorus/ui/src/**`.
- **CRA / older Webpack 4** — not supported without ejecting; build the package locally and consume the output.

## What's not included (yet)

- TypeScript type definitions (`.d.ts`). Components are typed implicitly via JSX prop usage; first-class types are planned.
- A prebuilt `dist/`. Source distribution is the current model.

## Versioning

Semver. Breaking changes to component props, slot names, or required CSS variables bump the major version. Token name changes are coordinated with `@blind-chorus/tokens`.
