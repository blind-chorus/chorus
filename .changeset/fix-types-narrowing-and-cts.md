---
"@blind-dsai/ui": patch
---

Three correctness fixes for the typed surface shipped in 0.5.0, plus build polish:

- **Fix discriminated-union narrowing on multi-sub families.** In 0.5.0 the `variant` literal was emitted as optional on every sub (e.g. `FormFieldSearchProps.variant?: "search"`), so `<FormField variant="search" …>` did not narrow under `if (props.variant === "search")` and `FormFieldProps` collapsed structurally back toward the input shape. The generator now marks `variant` optional only on the family's default sub (the one runtime defaults to) and required on every other sub, so `FormField / NavigationBar / Tabs / Chip / Button / List` props narrow correctly. This was the headline regression from the 0.5.0 release.
- **Emit `dist/index.d.cts` and `dist/icons/index.d.cts`.** Under `moduleResolution: node16` / `bundler`, CJS consumers resolve types from `.d.cts`, not `.d.ts`. 0.5.0 only shipped `.d.ts`, so CJS-typed consumers got "no types" silently. `package.json` `exports` now declares `types` per condition (`import → .d.ts`, `require → .d.cts`).
- **Thread the spec's `element` through `RefAttributes<…>`.** 0.5.0 typed every export's `ref` as `HTMLElement`. Now `Button` exposes `HTMLButtonElement`, `FormField/input/search` expose `HTMLInputElement`, etc., so `useRef<HTMLButtonElement>()` on the receiving end keeps its type through the component boundary.

Polish (same patch):

- `build-types.mjs` now reuses `loadManifest` / `loadFamily` / `readJson` from `schema/lint/` — one walker shared with the validators, no `readdirSync` scan that could pick up specs `family.json` deliberately omits.
- `tsup` no longer spawns a fresh Node to run the generator; it imports it via a URL-hopped `await import()` so cwd is irrelevant and the build saves ~120ms.
- `extractExports` now warns when it sees `export default` / `export *` (today a no-op in this package; future drift will be loud rather than silently shrinking the typed surface).
- `family.schema.json`'s `visualReuse` description is now a one-liner that points at `AGENTS.md` § Design principles — no more 700 chars of policy prose duplicated inside a JSON Schema.
