# Consuming `@blind-chorus/*` packages

This guide covers how a developer in another internal project pulls the Chorus design system from GitHub Packages.

## 1. Authenticate to GitHub Packages (one time per machine)

Create a Personal Access Token (classic) with `read:packages` scope at <https://github.com/settings/tokens>, then export it:

```bash
# ~/.zshrc or ~/.bashrc
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxx
```

## 2. Tell your project where `@blind-chorus` lives

Add an `.npmrc` to the root of your consuming project:

```
@blind-chorus:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Only the `@blind-chorus` scope routes to GitHub Packages — every other package keeps using the public npm registry.

## 3. Install

```bash
npm install @blind-chorus/tokens @blind-chorus/ui
```

`@blind-chorus/tokens` is a transitive dependency of `@blind-chorus/ui`, but installing it explicitly lets you import the CSS or the raw token JSON directly.

## 4. Import the stylesheets once at the entry

The components rely on CSS variables defined in `tokens.css`. Load both stylesheets exactly once at the top of your app:

```tsx
// app/layout.tsx (Next.js) — or main.tsx, _app.tsx, etc.
import "@blind-chorus/tokens/tokens.css";
import "@blind-chorus/ui/styles.css";
```

## 5. Use a component

```tsx
import { Button, Chip, Dialog } from "@blind-chorus/ui";

export function Example() {
  return (
    <>
      <Button variant="primary">Save</Button>
      <Chip selected>Filter</Chip>
    </>
  );
}
```

## 6. Use tokens directly in your own CSS

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
import lightTokens from "@blind-chorus/tokens/resolved.light.json" with { type: "json" };
```

## 7. CI access

Inside a GitHub Actions workflow in another repo, no extra PAT is needed — the built-in `GITHUB_TOKEN` works. Give the job `packages: read` permission and reuse the same `.npmrc`:

```yaml
permissions:
  contents: read
  packages: read

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: 20
  - run: npm ci
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Upgrading

```bash
npm update @blind-chorus/ui @blind-chorus/tokens
```

Changelogs are published with each release on the GitHub Releases page of the `blind-chorus/chorus` repo.
