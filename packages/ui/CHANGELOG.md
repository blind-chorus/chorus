# @blind-dsai/ui

## 0.7.0

### Minor Changes

- cfa89f5: Add two composite list components and unify the optional-header contract across SuggestionList / Carousel.

  **New components:**

  - **`DirectoryList`** — vertical follow-roster (`<Header />` + `<List variant="entry" size="large" />`). Sibling of SuggestionList: same entity-agnostic row anatomy (avatar + identity + trailing Toggle Button) but no swipeable pager — the full set is scanned vertically at the `large` (48 avatar) rung. Reach for it on browse / "new channels" / "people you may know" surfaces.
  - **`NavList`** — vertical label-only nav block (`<Header />` + `<List variant="nav" />`). Each row is a route target; trailing chevron supplied by the nav variant. Reach for it on category indexes, settings menus, and any "pick a sub-page" surface where no leading thumbnail belongs.

  Both wrappers share the SuggestionList surface chrome (`surface` fill, `container.lg` block / `container.md` inline padding, `stack.md` (16) header-to-list gap) and force the inner List into embedded mode so the wrapper owns the rail. Rows keep the list-family-default `container.md` inline padding for the touch target and add `margin-inline: -container.md` so the visible avatar / label lines up with the header label at 16 from the surface — same alignment trick SuggestionList uses for its page rows.

  **Header contract unified across composite blocks:**

  - `SuggestionList`, `Carousel` (`PostCarousel`, `ProfileCarousel`): `label` is required; the optional `headerAction` extends the header with a trailing `accent` Text Button when there's an index page to route to. The previously-documented `no header` and `no header action` variants are removed — every composite block now carries a label.
  - `Text Button` docs: `Accent` is promoted out of "Use cases" to a top-level type/appearance section directly under `Default`, matching the other appearance variants.

- ca53c95: Three correctness fixes for the 0.5.0 typed surface, plus two domain renames and eight industry-standard component aliases so AI consumers (Lovable, Cursor, v0) reach the right component on first try.

  **Correctness fixes (the 0.5.0 regressions):**

  - **Fix discriminated-union narrowing on multi-sub families.** In 0.5.0 the `variant` literal was emitted as optional on every sub (e.g. `FormFieldSearchProps.variant?: "search"`), so `<FormField variant="search" …>` did not narrow under `if (props.variant === "search")` and `FormFieldProps` collapsed structurally back toward the input shape. The generator now marks `variant` optional only on the family's default sub (the one runtime defaults to) and required on every other sub, so `FormField / NavigationBar / Tabs / Chip / Button / List` props narrow correctly. This was the headline regression from the 0.5.0 release.
  - **Emit `dist/index.d.cts` and `dist/icons/index.d.cts`.** Under `moduleResolution: node16` / `bundler`, CJS consumers resolve types from `.d.cts`, not `.d.ts`. 0.5.0 only shipped `.d.ts`, so CJS-typed consumers got "no types" silently. `package.json` `exports` now declares `types` per condition (`import → .d.ts`, `require → .d.cts`).
  - **Thread the spec's `element` through `RefAttributes<…>`.** 0.5.0 typed every export's `ref` as `HTMLElement`. Now `Button` exposes `HTMLButtonElement`, `FormField/input/search` expose `HTMLInputElement`, etc., so `useRef<HTMLButtonElement>()` on the receiving end keeps its type through the component boundary.

  **Domain renames** (canonical name moves; old names stay as deprecated runtime + type aliases via `spec.exportAlias`):

  - `ChannelList` → **`SuggestionList`**. The anatomy is "swipeable pager of follow-suggestion rows (avatar + name + meta lines + Follow toggle)" — entity-agnostic. The old `channel-list` was a misleading domain word.
  - `ChannelRail` → **`AvatarRail`**. Horizontal avatar+label entry rail — `avatar-rail` describes the shape directly.
  - Both schema folders are renamed (`schema/components/{suggestion-list,avatar-rail}/`); all references across `manifest.json`, `catalog.md`, `AGENTS.md`, `LOVABLE.md`, screen recipes, agent guides, and docs site are updated. CSS class names (`chorus-channel-list` → `chorus-suggestion-list`, `chorus-channel-rail` → `chorus-avatar-rail`) renamed in `styles.css`.

  **Industry-standard aliases** (declared via the new `spec.exportAlias` field; each emits an extra `<Alias>Props = Omit<SourceProps, "variant">` so the `variant` discriminator stays out of the alias surface):

  - `Sheet` ← `BottomSheet` (shadcn naming)
  - `Alert` ← `Banner` (shadcn naming)
  - `Avatar` ← `Thumbnail` (shadcn / Material naming)
  - `AppBar` ← `NavigationBar / home` (Material naming)
  - `BottomNav` ← `TabBar` (Material naming)
  - `Input` ← `FormField / input` (drops the `variant="input"` boilerplate)
  - `SearchBar` ← `FormField / search`
  - `Select` ← `FormField / select`

  **Build / generator polish (rolled into the same release):**

  - `build-types.mjs` now reuses `loadManifest` / `loadFamily` / `readJson` from `schema/lint/` — one walker shared with the validators, no `readdirSync` scan that could pick up specs `family.json` deliberately omits.
  - `tsup` no longer spawns a fresh Node to run the generator; it imports it via a URL-hopped `await import()` so cwd is irrelevant and the build saves ~120ms.
  - `extractExports` now warns when it sees `export default` / `export *` (today a no-op in this package; future drift will be loud rather than silently shrinking the typed surface).
  - `family.schema.json`'s `visualReuse` description is now a one-liner that points at `AGENTS.md` § Design principles — no more 700 chars of policy prose duplicated inside a JSON Schema.
  - `spec.schema.json` adds the `exportAlias` field (string or array of strings) so the alias mechanism is JSON-schema-checked instead of being a side-channel convention.

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
