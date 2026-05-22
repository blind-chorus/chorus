# Consuming `@blind-dsai/*` packages

`@blind-dsai/ui` and `@blind-dsai/tokens` are published on the public npm registry. No auth, no `.npmrc` setup. External tools (Lovable, v0, Cursor, Claude Code) and internal apps install them the same way as any public package.

## Install

```bash
npm install @blind-dsai/tokens @blind-dsai/ui
```

`@blind-dsai/tokens` is a transitive dependency of `@blind-dsai/ui`, but installing it explicitly lets you import the CSS or the raw token JSON directly. Peer dependency: `react >= 18`.

## Import the stylesheets once at the entry

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

## Use a component

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

## Dark mode

Tokens flip on the `data-theme` attribute. Set it on `<html>` (or any subtree):

```html
<html data-theme="dark">
```

No-script default is light; set the attribute server-side or in an inline `<script>` before paint to avoid a flash.

## Use tokens directly in your own CSS

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

## Lovable — overlay the `lovable-export/` snapshot

If you're building inside [Lovable](https://lovable.dev), don't `npm install` the packages — Lovable only syncs via GitHub and expects a Vite/TanStack-Router source tree. This repo ships that tree pre-built at [`lovable-export/`](lovable-export), regenerated from `schema/` + `packages/ui/` by `npm run build:lovable`.

The handoff is a one-way **manual overlay** into your Lovable-connected GitHub repo (typically a fork of [`chorus-lovable-template-v1`](https://github.com/blind-dsai/chorus-lovable-template-v1)). `lovable-export/` is pre-organized into three buckets matched to a macOS Finder drag/drop workflow:

```
lovable-export/import/
├── step1-merge-to-root/    → drop on repo root,  pick "Merge"
├── step2-replace-to-root/  → drop on repo root,  pick "Replace"
└── step3-replace-to-src/   → drop into src/,     pick "Replace"
```

Full step-by-step (with rationale for each option) is in [`lovable-export/IMPORT.md`](lovable-export/IMPORT.md). After the three drags: `git status` to review, `bun install` only if `package.json` changed, commit, push. Lovable picks up the change on its next sync.

**Hard rules:**

- **Three buckets, three drags.** The split exists because the buckets land at different depths (root vs root vs `src/`) and macOS Finder can't choose merge-vs-replace per-folder mid-drag. Don't merge them or rsync the whole `lovable-export/` directly — that would dump the `import/` wrapper into the target repo.
- **Preserve editor-managed files.** Step 1 is "Merge" precisely so `.lovable/`, `bun.lock`, `src/components/ui/*` (shadcn primitives Lovable installs on demand), and Lovable-authored routes survive.
- **One-way sync.** chorus → lovable only. Anything you want to keep across re-exports must live in chorus (`schema/`, `packages/ui/`, `patterns/`). Lovable-side edits outside the chorus-owned paths (steps 2 & 3 contents) survive; edits inside them get overwritten on the next sync.
- **Re-run before each copy.** `npm run build:lovable` is idempotent and wipes the generated outputs (`step2/docs/`, `step3/components/chorus/`, `step1/public/`, `step1/src/styles.css`) on each run, so the export always matches current chorus state.

Files we own and overwrite, files in the shared zone, and the full rationale are documented in [`lovable-export/README.md`](lovable-export/README.md). The agent contract Lovable's editor reads after the copy is [`lovable-export/AGENTS.md`](lovable-export/AGENTS.md).

## Native (iOS / Android) — pilot

The same tokens are generated into Swift and Kotlin sources:

- **iOS (SwiftUI):** `packages/tokens-ios` (Swift Package `ChorusTokens`) + `packages/ui-ios` (`ChorusUI`, currently shipping `ChorusButton`).
- **Android (Compose):** `packages/tokens-android` (`chorus-tokens` Gradle module) + `packages/ui-android` (`chorus-ui`, currently shipping `ChorusButton`).

Token regeneration after editing `schema/tokens/*.json`:

```bash
node packages/tokens-ios/scripts/codegen.mjs
node packages/tokens-android/scripts/codegen.mjs
```

Generated files live under `packages/tokens-ios/Sources/ChorusTokens/Generated/` and `packages/tokens-android/chorus-tokens/src/main/kotlin/dev/blinddsai/chorus/tokens/generated/`. The handcrafted `ChorusTheme` (Compose) wraps the palette in a `CompositionLocal`; SwiftUI consumers use `@Environment(\.colorScheme)` and `ChorusColors.themed(for:)`.

A drift check (`node packages/tokens-{ios,android}/scripts/check.mjs`) runs in CI and exits non-zero if `schema/tokens/*.json` changed without the matching `Generated/*` regenerated — keeping the three implementations (web, iOS, Android) in lockstep.

Pilots shipped so far: Button (full spec) and Chip (filter + tag). The remaining components in `schema/components/` are not yet ported.

## Upgrading

```bash
npm update @blind-dsai/ui @blind-dsai/tokens
```

Changelogs are published with each release on the GitHub Releases page of the `blind-dsai/chorus` repo, and inside each package's `CHANGELOG.md`.
