# @blind-dsai/ui

React component library for the Chorus design system. Ships prebuilt ESM + CJS bundles (`dist/`) and a single `styles.css`; import once and use.

The component contract (anatomy, slots, token bindings) lives in `schema/components/<family>/<sub>.spec.json` in the [Chorus monorepo](https://github.com/blind-dsai/chorus). This package is the React reference implementation of that contract.

> **License:** MIT. See [`LICENSE`](../../LICENSE).

## Install

```bash
npm install @blind-dsai/ui @blind-dsai/tokens
```

Public on npmjs.org — no auth, no `.npmrc` setup required. Peer dependency: `react >= 18`.

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

## Use tokens directly in your own CSS

Every system token is emitted as a CSS custom property by `@blind-dsai/tokens/tokens.css`:

```css
.card {
  background: var(--sys-color-surface);
  color: var(--sys-color-on-surface);
  border: 1px solid var(--sys-color-outline-variant);
}
```

Or read the resolved JSON in build tooling:

```js
import lightTokens from '@blind-dsai/tokens/resolved.light.json' with { type: 'json' };
```

## Agent-friendly docs (Lovable, Cursor, Claude Code, …)

The package self-contains the docs an LLM agent needs. After `npm install`, they live under `node_modules/@blind-dsai/ui/agents/`:

| File | Purpose |
| :--- | :--- |
| `agents/DESIGN_PRINCIPLES.md` | Lovable system-prompt source — paste §1 once per session, §2 per task. |
| `agents/AGENTS.md` | Hard contract every Chorus-aware agent obeys. |
| `agents/catalog.md` | Intent → component map. |
| `agents/manifest.json` | Component inventory. |
| `agents/DESIGN.md` | Token model, four guiding principles, authorized literal exceptions. |

Also shipped: `@blind-dsai/ui/placeholder_thumbnail.png` — copy once into your app's `public/` and reference as `src="/placeholder_thumbnail.png"`.

## Native sibling packages (pilot)

The same tokens are generated into Swift and Kotlin sources. UI implementations are early — Button (full spec) and Chip (filter + tag) ported so far:

- **iOS (SwiftUI):** [`@blind-dsai/tokens-ios`](https://github.com/blind-dsai/chorus/tree/main/packages/tokens-ios) (`ChorusTokens`) + [`@blind-dsai/ui-ios`](https://github.com/blind-dsai/chorus/tree/main/packages/ui-ios) (`ChorusUI`).
- **Android (Compose):** [`@blind-dsai/tokens-android`](https://github.com/blind-dsai/chorus/tree/main/packages/tokens-android) (`chorus-tokens`) + [`@blind-dsai/ui-android`](https://github.com/blind-dsai/chorus/tree/main/packages/ui-android) (`chorus-ui`).

CI runs `node packages/tokens-{ios,android}/scripts/check.mjs` and fails if `schema/tokens/*.json` changed without the matching generated Swift/Kotlin sources being regenerated — keeping web, iOS, and Android in lockstep.

## Upgrading

```bash
npm update @blind-dsai/ui @blind-dsai/tokens
```

Changelogs are published with each release on the [GitHub Releases](https://github.com/blind-dsai/chorus/releases) page of `blind-dsai/chorus` and inside each package's `CHANGELOG.md`.

## Versioning

Semver. Breaking changes to component props, slot names, or required CSS variables bump the major version. Token name changes are coordinated with `@blind-dsai/tokens`.
