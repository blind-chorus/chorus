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
| authored content stream (posts, comments)    | `feed / feed`            |
| follow suggestions block                     | `suggestion-list`           |

**Disambiguate**: `feed` = authored content (author, body, footer). `list` = menus/settings/pickers. `suggestion-list` = labelled swipeable block of follow-suggestions (channels, people, companies, topics — same anatomy).

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

## Disambiguation cheat sheet

These are *first-pass* defaults for open families and *hard rules* for locked families.

- **Filter chip vs Toggle button** (both open): `chip/filter` for facet selection in a chip row; `button/toggle` for standalone reversible state. Either visual shape may be reused outside its canonical intent if the design calls for it.
- **Tag chip vs Badge** (both open): `chip/tag` = text metadata; `badge` = numeric count attached to a host. Visual shapes are reusable — e.g. a `badge` styled as a small status pill is fine even without a numeric count.
- **List vs Feed** (both open): same-kind rows → List, authored content stream → Feed *as a default*. Either may be reused for a different content shape if the layout fits — e.g. a `Feed`-style card hosting a non-post summary, or a `List` row hosting an editorial item.
- **BottomSheet vs Dialog** (both locked): short/actionable/one-thumb → BottomSheet; confirmation or image-led → Dialog. **Never** borrow either shape for a non-modal surface — their dismiss/focus contracts are the whole point.
- **Banner vs BottomSheet**: in-flow context → `banner` (open, may be reused as a generic tonal block). Demands a commit before continuing → `bottom-sheet` *(locked)*.
- **Toast vs Tooltip vs Banner**: all three describe "short message", but `toast` *(locked)* is auto-dismissing and `tooltip` *(locked)* is trigger-anchored — visual reuse outside those interaction roles is forbidden. For a static "small message" that lives in the reading flow, reach for `banner` (open) instead.
