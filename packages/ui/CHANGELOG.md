# @blind-dsai/ui

## 0.5.0

### Minor Changes

- 867f2c0: Ship a typed surface and an agent-side search decision tree so AI consumers (Lovable, Cursor, v0) can autocomplete Chorus components instead of falling back to `ComponentType<any>` shims.

  - **Generated `dist/index.d.ts` + `dist/icons/index.d.ts`.** A new build step (`packages/ui/scripts/build-types.mjs`, hooked into `tsup` `onSuccess`) reads every `schema/components/<family>/<sub>.spec.json` and emits typed interfaces. Multi-sub families (Button, FormField, NavigationBar, Tabs, Chip, List) become discriminated unions keyed on the literal `variant` prop, so `<FormField variant="search" placeholder="…" onChange={…}>` now resolves to a concrete `FormFieldSearchProps` with the input's native HTML attributes mixed in. `package.json` declares `"types"` at the top level and on every `exports` condition.
  - **`react-dom` added to `peerDependencies`** — Dialog and BottomSheet already `import { createPortal } from "react-dom"`; the manifest now matches the runtime.
  - **Agent-side improvements (shipped via `agents/`):** the `LOVABLE.md` readiness line now requires four explicit evidence items (manifest, catalog, `dist/index.d.ts`, one relevant spec) before the agent posts "✅ Chorus ready", with an instruction to delete any consumer-side `ComponentType<any>` shim. The catalog adds a "Search affordance — three candidates" table mapping the natural-language intent "search" to `NavigationBar/search`, `FormField/search`, or `FormField/input + leadingIcon` depending on surface, so agents stop hand-rolling `<input>` elements when they "can't find" the component.
  - **Design principles (`AGENTS.md`, `agents/LOVABLE.md`, docs `/agent-guide#agent-principles`)** now reference each family's `visualReuse: "open" | "locked"` flag (added to every `<family>.family.json`). Open families (13: badge, banner, button, channel-list, channel-rail, chip, feed, list, navigation-bar, section, tab-bar, tabs, thumbnail) may be reached for on visual-fit grounds; locked families (5: dialog, bottom-sheet, toast, tooltip, form-field) are restricted to their canonical role because the interaction contract is the point.

## 0.3.1

### Patch Changes

- 3cdf963: Update README and CONSUMING guide for public npm install — drop GitHub Packages auth setup, drop "source-distributed (no prebuilt dist)" wording. `npm install @blind-dsai/ui @blind-dsai/tokens` now works without any `.npmrc` or token.
- Updated dependencies [3cdf963]
  - @blind-dsai/tokens@0.3.1

## 0.3.0

### Minor Changes

- be6c9af: First public release on npmjs.org. Switch publish target from GitHub Packages (private) to the public npm registry so external tools (Lovable, v0, Cursor, Claude Code) can `npm install @blind-dsai/ui @blind-dsai/tokens` without auth.

### Patch Changes

- Updated dependencies [be6c9af]
  - @blind-dsai/tokens@0.3.0

## 0.2.0

### Minor Changes

- d2cc609: Initial release of `@blind-dsai/tokens` and `@blind-dsai/ui`.

  - `@blind-dsai/tokens`: three-tier design tokens (reference / system / component) shipped as JSON bundles and a single `tokens.css` with CSS custom properties for both light and dark themes.
  - `@blind-dsai/ui`: React component library (Badge, BottomSheet, Button, Callout, ChannelList, ChannelRail, Chip, Dialog, Feed, FormField, List, NavigationBar, Tab, TabBar, Tabs, Thumbnail) shipped as prebuilt ESM + CJS bundles with a sibling `styles.css`.

### Patch Changes

- Updated dependencies [d2cc609]
  - @blind-dsai/tokens@0.2.0
