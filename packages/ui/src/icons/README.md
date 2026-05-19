# `@blind-dsai/ui/icons`

The Chorus icon library. Every product glyph that appears in `packages/ui` components or `apps/docs` pages is sourced from this module. The **principle** (why everything routes through here, when inline `<svg>` is permitted) lives in [`schema/DESIGN.md`](../../../../schema/DESIGN.md) under `### Iconography → Source of truth`; this README is the **recipe** for adding to and consuming the library.

## Importing

```jsx
import { PollIcon, BookmarkIcon } from '@blind-dsai/ui/icons';

<PollIcon />                  // 20px (icon.md), inherits color
<BookmarkIcon size={16} />    // explicit size
<PollIcon className="…" aria-label="Poll" />  // forwarded to the <svg>
```

Subpath export is wired in `packages/ui/package.json`. The same import path works from inside `packages/ui` and from any docs page.

## Adding a new icon

1. **Drop the source SVG** in `packages/ui/src/icons/svg/` named in PascalCase (`Bell.svg`, `BellFill.svg`). The source file is the original artwork — keep it as exported, no hand edits beyond stripping `xmlns` clutter.
2. **Register a component** in `index.js` via the `makeIcon(...)` helper:

   ```jsx
   export const BellIcon = makeIcon(
     'BellIcon',
     <path d="…" fill="currentColor" />,
     ['bell', 'notification', 'alert'],
   );
   ```

   The helper handles the `<svg>` wrapper (24×24 viewBox, `size` prop default 20, prop forwarding). You supply the path element(s) and a keywords array (used by the docs catalog for search-ahead).
3. **Add it to the `icons` registry** at the bottom of `index.js`, alphabetized. The registry powers the docs catalog automatically — no separate listing to maintain.

That's the entire flow. No build step, no codegen — JSX import only.

## Authoring rules

These match the three-rule contract documented in DESIGN.md:

- **24×24 grid.** `viewBox="0 0 24 24"`. Glyphs designed at other grids will land off-rhythm beside the type scale.
- **`currentColor` only.** Every `fill` and `stroke` must be `currentColor` so the icon inherits the surrounding `on*` foreground. A hardcoded color forfeits dark-mode correctness.
- **No hardcoded size.** Do not bake `width`/`height` into the SVG markup — the `makeIcon` helper wires `size` (defaulting to 20px / `icon.md`) and lets callers override. Sizes ride the `icon.*` ladder: `16` (`sm`), `20` (`md`, default), `24` (`lg`), `32` (`xl`).

## Filled vs outlined pairs

Many glyphs ship as a pair (`BookmarkIcon` / `BookmarkFillIcon`, `VisibleIcon` / `VisibleFillIcon`, `ReplyIcon` / `ReplyFillIcon`, `ThumbUpIcon` / `ThumbUpFillIcon`). The `Fill` suffix marks the **selected / committed** state of the same glyph — per DESIGN.md, fill vs outline is a state signal, not a stylistic choice. Use the outlined form at rest and switch to the filled form when the toggle is engaged; never swap to filled for emphasis.

When adding a new glyph that has a state-active form, register both at the same time so callers don't have to invent the filled variant inline.

## Catalog

The docs site renders the full library at the Iconography page in `/iconography` (and the per-icon search at `/icons` once the catalog table lands). Both pages read directly from the `icons` registry, so newly added entries appear without further wiring.
