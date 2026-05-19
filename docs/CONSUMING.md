# Consuming `@blind-dsai/*` packages

`@blind-dsai/ui` and `@blind-dsai/tokens` are published on the public npm registry. No auth, no `.npmrc` setup. External tools (Lovable, v0, Cursor, Claude Code) and internal apps install them the same way as any public package.

## 1. Install

```bash
npm install @blind-dsai/tokens @blind-dsai/ui
```

`@blind-dsai/tokens` is a transitive dependency of `@blind-dsai/ui`, but installing it explicitly lets you import the CSS or the raw token JSON directly. Peer dependency: `react >= 18`.

## 2. Import the stylesheets once at the entry

The components rely on CSS variables defined in `tokens.css`. Load both stylesheets exactly once at the top of your app:

```tsx
// app/layout.tsx (Next.js) — or main.tsx, _app.tsx, etc.
import "@blind-dsai/tokens/tokens.css";
import "@blind-dsai/ui/styles.css";
```

Then load Pretendard — the only typeface Chorus speaks:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

## 3. Use a component

```tsx
import { Button, Chip, Callout } from "@blind-dsai/ui";

export function Example() {
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

## 4. Dark mode

Tokens flip on the `data-theme` attribute. Set it on `<html>` (or any subtree):

```html
<html data-theme="dark">
```

No-script default is light; set the attribute server-side or in an inline `<script>` before paint to avoid a flash.

## 5. Use tokens directly in your own CSS

Every system token is emitted as a CSS custom property:

```css
.card {
  background: var(--sys-color-surface);
  color: var(--sys-color-on-surface);
  border: 1px solid var(--sys-color-outline-variant);
}
```

Or read the resolved JSON in build tooling:

```js
import lightTokens from "@blind-dsai/tokens/resolved.light.json" with { type: "json" };
```

## Upgrading

```bash
npm update @blind-dsai/ui @blind-dsai/tokens
```

Changelogs are published with each release on the GitHub Releases page of the `blind-dsai/chorus` repo, and inside each package's `CHANGELOG.md`.
