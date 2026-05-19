# @blind-dsai/ui

React component library for the Chorus design system. Ships prebuilt ESM + CJS bundles (`dist/`) and a single `styles.css`; import once and use.

The component contract (anatomy, slots, token bindings) lives in `schema/components/<family>/<sub>.spec.json` in the [Chorus monorepo](https://github.com/blind-dsai/chorus). This package is the React reference implementation of that contract.

> **License:** MIT. See [`LICENSE`](../../LICENSE).

## Install

This package is distributed through GitHub Packages, not the public npm registry. See [`docs/CONSUMING.md`](../../docs/CONSUMING.md) in the repo for the one-time `.npmrc` and authentication setup; once that's in place:

```bash
npm install @blind-dsai/ui @blind-dsai/tokens
```

Peer dependency: `react >= 18`.

## Setup

Two stylesheets and one font, loaded once at your app entry.

```js
// app entry (e.g. Next.js app/layout.tsx, Vite main.tsx)
import '@blind-dsai/tokens/tokens.css';
import '@blind-dsai/ui/styles.css';
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
import { Button, Chip, Callout } from '@blind-dsai/ui';

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

## Versioning

Semver. Breaking changes to component props, slot names, or required CSS variables bump the major version. Token name changes are coordinated with `@blind-dsai/tokens`.
