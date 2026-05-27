# Catalog — intent → component

Reverse index from natural-language intent to family + sub-component. Read this *before* opening any spec to narrow candidate families. Authoritative shape lives in `schema/components/<family>/<sub>.spec.json`; this file is a routing layer.

## How intent binding works

Each family declares `visualReuse: "open" | "locked"` in its `<family>.family.json`. The catalog respects that flag.

- **Open (default, 13 families)** — `badge`, `banner`, `button`, `suggestion-list`, `avatar-rail`, `chip`, `feed`, `list`, `navigation-bar`, `section`, `tab-bar`, `tabs`, `thumbnail`. The intent table is the *first* suggestion, but the agent MAY reach for these on visual-fit grounds even when the brief's intent does not match the row verbatim — e.g. using `<Feed>` as a generic article-card surface, `<Banner>` as a tonal aside outside a literal "notice" context, `<Section>` as any labelled editorial block. Anatomy invariants (slot grammar, token bindings, intrinsic geometry) still apply.
- **Locked (5 families)** — `dialog`, `bottom-sheet`, `toast`, `tooltip`, `form-field`. MUST only be used when the brief's intent matches a row. Their contract IS the interaction — focus trap, auto-dismiss, ARIA live region, form semantics, hover/focus trigger. Borrowing the visual shape without the role breaks the behavior. Marked *(locked)* in the tables below.

When in doubt: open families are recipes, locked families are rules.

## Top bars

| Intent                                | Family + sub                       |
| ------------------------------------- | ---------------------------------- |
| landing screen header, title bar      | `navigation-bar / home`            |
| drill-in screen header, back + title  | `navigation-bar / page`            |
| search screen header, input fills bar | `navigation-bar / search`          |

**Disambiguate**: never stack two NavigationBars. Pick by *screen kind*, not *content kind*.

## Action commits

| Intent                                     | Family + sub                  |
| ------------------------------------------ | ----------------------------- |
| primary inline commit (Save, Continue)     | `button / standard`           |
| canonical floating commit (Compose, New)   | `button / fab`                |
| icon-only inline commit                    | `button / icon`               |
| link-shaped commit, low emphasis           | `button / text`               |
| option toggle next to a primary commit     | `button / check`              |
| reversible state (mute/unmute, follow)     | `button / toggle`             |
| dense action inside a toolbar              | `button / toolbar`            |
| destructive primary commit                 | `button / standard` with `flavor: "destructive"` (inside a Dialog) |

**Disambiguate**: FAB = the **single** canonical commit per screen. Destructive primary commits go in `dialog`/`bottom-sheet`, not on a FAB.

## Vertical content surfaces

| Intent                                       | Family + sub             |
| -------------------------------------------- | ------------------------ |
| settings / menu / picker rows                | `list / text` or `/ nav` |
| single-select option group                   | `list / radio`           |
| avatar-anchored rows (channels, DMs)         | `list / thumbnail`       |
| drill-in rows with trailing chevron          | `list / nav`             |
| standalone drill-in card (single row)        | `nav-card`               |
| expandable titled sections (FAQ, T&C)        | `accordion`              |
| authored content stream (posts, comments)    | `feed / feed`            |
| follow suggestions block                     | `suggestion-list`           |

**Disambiguate**: `feed` = authored content (author, body, footer). `list` = menus/settings/pickers (stacked rows, hairline divider chrome). `nav-card` = a SINGLE drill-in row as its own bounded outlined card — reach for it when one drill-in needs to read as its own affordance, not as one entry in a stack. `accordion` = stacked rows that EXPAND in place rather than drill-in — reach for it when each row holds short content the user opens to read (FAQ, T&C, expandable filter group). `suggestion-list` = labelled swipeable block of follow-suggestions (channels, people, companies, topics — same anatomy).

## Horizontal content surfaces

| Intent                                  | Family + sub             |
| --------------------------------------- | ------------------------ |
| compact horizontal entity quick-nav      | `avatar-rail`           |
| section tabs with sliding indicator     | `tabs / underline`       |
| chip-shaped tab row with leading icons  | `tabs / rounded`         |
| in-place mode toggle (List ↔ Grid)      | `tabs / segmented`       |

## Modal surfaces

| Intent                                              | Family + sub        |
| --------------------------------------------------- | ------------------- |
| short focused commit anchored to bottom of viewport | `bottom-sheet` *(locked)* |
| confirmation prompt, centered                       | `dialog` *(locked)* |
| destructive confirmation                            | `dialog` *(locked)* with destructive primary action |
| inline notice inside the content column             | `banner / accent` or `/ default` (not modal) |
| transient post-action confirmation (saved, copied)  | `toast` *(locked)* — non-modal, auto-dismiss |
| trigger-anchored hint over a hovered/focused control | `tooltip` *(locked)* — non-modal, hover/focus-driven |

**Disambiguate**: `bottom-sheet`/`dialog` are modal — require a trigger elsewhere. `banner` is not modal; lives in the content column. `toast` is non-modal and self-dismissing — reach for it only when the action has already landed and no decision is needed. `tooltip` is non-modal and floats over a specific trigger — reach for it only when the message describes a hovered/focused control.

## Inputs

| Intent                                | Family + sub               |
| ------------------------------------- | -------------------------- |
| labeled single-line text field        | `form-field / input` *(locked)* |
| bare pill search input                | `form-field / search` *(locked)* |

**Disambiguate**: `form-field` is *(locked)* — use it only for real text entry. If you want an Input-shaped read-only display row, reach for a `list / text` row or a token-faithful primitive rather than borrowing the form-field shell (the `<input>` semantics, label binding, and a11y plumbing would lie).

### Search affordance — three candidates, pick by surface

"Search" maps to three different Chorus rungs depending on where the field sits on screen. Do NOT default to the first one that comes to mind — and do NOT fall back to a hand-rolled `<input>` because you "couldn't find" a search component. All three exist and are typed in `dist/index.d.ts`:

| Surface (where the field lives)                                | Component                                            | Why                                                                                                                          |
| -------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Top bar takes the whole row** (search mode of a screen)       | `<NavigationBar variant="search">`                   | The bar IS the field. Owns back chevron + bare input + clear button as one chrome unit. Use when entering "search mode" of a screen. |
| **Inline filter / list-top / sheet-top** (chrome, not a form)   | `<FormField variant="search">`                       | The bare pill — leading magnifier glyph, focus-only clear button, no label / helper / maxLength. The affordance is the glyph. |
| **Inside a real form** (search-shaped input that needs a label) | `<FormField variant="input" leadingIcon={<SearchIcon/>} label="…" helper="…">` | Use when the field needs a visible label, helper text, error appearance, or character count — `search` has none of those.    |

Each row resolves to a typed React component — `<FormField variant="search" placeholder="…" onChange={…}>` autocompletes from `dist/index.d.ts`. If your IDE shows `ComponentType<any>`, you are reading a stale shim, not the package's published types — delete the shim and re-resolve.

## Compact controls

| Intent                                       | Family + sub      |
| -------------------------------------------- | ----------------- |
| toggle chip for facet selection              | `chip / filter`   |
| informational / dismissable metadata pill    | `chip / tag`      |
| numeric unread / update count                | `badge`           |
| inline image (avatar, list leading, channel) | `thumbnail`       |
| instant-commit on/off toggle                 | `switch`          |
| inline status mark next to a row label       | `status-tag`      |

**Disambiguate**: `switch` = single binary on/off that commits the moment it flips (notifications on/off, privacy toggle). For multi-option pickers use `list / radio`; for actions that need confirmation use `button` + `dialog`; for "selected" facet state in a chip row use `chip / filter`. `status-tag` = a SMALL (16-rung, 10px text) decorative status pill inline next to a row label — "pending", "rejected", "draft"; for a 32-rung interactive chip in a chip row use `chip / tag`; for a numeric count attached to an icon / thumbnail use `badge`.

## Loading & placeholder

| Intent                                                | Family + sub          |
| ----------------------------------------------------- | --------------------- |
| in-flight content placeholder (mirrors content shape) | `skeleton`            |
| linear progress for a known long-running task          | `progress`            |

**Disambiguate**: `skeleton` = an *in-flight* tonal block that previews where content will land. Reach for it when data is loading and the host would otherwise paint as an empty surface. NOT for empty states (no data yet) — those use an illustration + body copy, not a pulsing placeholder. `progress` = a slim track communicating how far a *long-running, identifiable* task has advanced (upload, onboarding step, background sync). Use `indeterminate` when busy without a known ratio. For sub-300ms waits use neither — just paint the result.

## Shadcn / Lovable name translation

When an AI agent (or a designer paging in from the shadcn vocabulary) reaches for a shadcn-named component, this is the Chorus surface to render. Direct React `export` aliases live in `packages/ui/src/index.js` where the name doesn't already collide (`Sheet`, `Drawer`, `Alert`, `Avatar`, `AppBar`, `BottomNav`); the table below covers the remaining mappings — including the ones where Chorus splits one shadcn shape into multiple intent-bound surfaces.

| Shadcn / Lovable name              | Chorus surface to render                                                            | Notes |
|-----------------------------------|------------------------------------------------------------------------------------|-------|
| `<Alert variant="default">`        | `<Banner appearance="default">`                                                     | Already aliased — `import { Alert } from '@blind-dsai/ui'`. |
| `<Alert variant="destructive">`    | `<Banner appearance="destructive">`                                                 | Use the destructive appearance added for this mapping. |
| `<Badge variant="…">` *(text pill)* | `<StatusTag appearance="neutral \| error">`                                          | Chorus `Badge` is a numeric / dot count marker — same name, different intent. Text-pill `<Badge>` calls must translate to `StatusTag`. |
| `<Avatar>` (image+fallback compound) | `<Thumbnail src=… alt=… />`                                                         | Already aliased — `import { Avatar } from '@blind-dsai/ui'`. Use Thumbnail's `imageFallbackImage` / `imageFallbackText` props instead of the `<AvatarFallback>` child. |
| `<Card>` (generic bordered block)  | One of: `<Section>` (labelled editorial block), `<Feed>` (authored content), `<NavCard>` (drill-in row), `<Banner>` (tonal aside) | Chorus splits "Card" by intent — pick by what the block carries, not by the chrome. |
| `<Carousel>`                       | `<PostCarousel>` (cards) or `<ProfileCarousel>` (avatar-anchored)                   | Pick by content rung — Chorus carousels are specialised. |
| `<DropdownMenu>` (floating menu)   | `<BottomSheet>` with a `List`                                                       | Mobile-first substitution — floating menus collide with one-thumb reach. |
| `<HoverCard>` / `<Popover>`        | `<Tooltip>` (short text) or `<BottomSheet>` (multi-line / actionable)               | Hover-anchored surfaces don't translate to mobile; the tooltip / sheet contract owns the affordance. |
| `<RadioGroup>` + `<RadioGroupItem>` | `<List variant="radio" items={[…]} onChange=… />`                                    | Chorus's only radio surface IS the list row. |
| `<Sheet side="bottom">`            | `<BottomSheet>`                                                                     | Aliased — `import { Sheet } from '@blind-dsai/ui'`. Only the bottom side ships; top / left / right are out of mobile scope. |
| `<Sonner>` / `toast()` imperative  | `<Toast>` declarative                                                               | Chorus toast is declarative — render `<Toast>` from the host surface; no imperative `toast()` call. |
| `<ToggleGroup type="single">`      | `<Tabs variant="segmented">`                                                        | In-place mode toggle. |
| `<ToggleGroup type="multiple">`    | A row of `<Chip variant="filter">`                                                  | Multi-select facet selection. |

## Disambiguation cheat sheet

These are *first-pass* defaults for open families and *hard rules* for locked families.

- **Filter chip vs Toggle button** (both open): `chip/filter` for facet selection in a chip row; `button/toggle` for standalone reversible state. Either visual shape may be reused outside its canonical intent if the design calls for it.
- **Tag chip vs Badge vs StatusTag** (open): `chip/tag` = 32-rung selectable text metadata; `badge` = numeric count / dot attached to a host icon or thumbnail; `status-tag` = 16-rung decorative inline status pill next to a row label.
- **List vs Feed** (both open): same-kind rows → List, authored content stream → Feed *as a default*. Either may be reused for a different content shape if the layout fits — e.g. a `Feed`-style card hosting a non-post summary, or a `List` row hosting an editorial item.
- **BottomSheet vs Dialog** (both locked): short/actionable/one-thumb → BottomSheet; confirmation or image-led → Dialog. **Never** borrow either shape for a non-modal surface — their dismiss/focus contracts are the whole point.
- **Banner vs BottomSheet**: in-flow context → `banner` (open, may be reused as a generic tonal block). Demands a commit before continuing → `bottom-sheet` *(locked)*.
- **Toast vs Tooltip vs Banner**: all three describe "short message", but `toast` *(locked)* is auto-dismissing and `tooltip` *(locked)* is trigger-anchored — visual reuse outside those interaction roles is forbidden. For a static "small message" that lives in the reading flow, reach for `banner` (open) instead.
- **Skeleton vs Progress**: `skeleton` previews *where content will land* (a placeholder that swaps out atomically). `progress` shows *how far a task has advanced* (a value-bound or busy indicator). For sub-300ms waits use neither.
