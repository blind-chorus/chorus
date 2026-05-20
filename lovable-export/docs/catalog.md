# Catalog — intent → component

Reverse index from natural-language intent to family + sub-component. Read this *before* opening any spec to narrow candidate families. Authoritative shape lives in `components/<family>/<sub>.spec.json`; this file is a routing layer.

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
| channel directory                            | `channel-list`           |

**Disambiguate**: `feed` = authored content (author, body, footer). `list` = menus/settings/pickers. `channel-list` is channel directories only.

## Horizontal content surfaces

| Intent                                  | Family + sub             |
| --------------------------------------- | ------------------------ |
| compact horizontal channel nav          | `channel-rail`           |
| section tabs with sliding indicator     | `tabs / underline`       |
| chip-shaped tab row with leading icons  | `tabs / rounded`         |
| in-place mode toggle (List ↔ Grid)      | `tabs / segmented`       |

## Modal surfaces

| Intent                                              | Family + sub        |
| --------------------------------------------------- | ------------------- |
| short focused commit anchored to bottom of viewport | `bottom-sheet`      |
| confirmation prompt, centered                       | `dialog`            |
| destructive confirmation                            | `dialog` with destructive primary action |
| inline notice inside the content column             | `callout / info` or `/ neutral` (not modal) |
| transient post-action confirmation (saved, copied)  | `toast` (non-modal, auto-dismiss) |

**Disambiguate**: `bottom-sheet`/`dialog` are modal — require a trigger elsewhere. `callout` is not modal; lives in the content column. `toast` is non-modal and self-dismissing — reach for it only when the action has already landed and no decision is needed.

## Inputs

| Intent                                | Family + sub               |
| ------------------------------------- | -------------------------- |
| labeled single-line text field        | `form-field / input`       |
| bare pill search input                | `form-field / search`      |

**Disambiguate**: if search fills the top bar, use `navigation-bar / search` instead of dropping `search` into `home`.

## Compact controls

| Intent                                       | Family + sub      |
| -------------------------------------------- | ----------------- |
| toggle chip for facet selection              | `chip / filter`   |
| informational / dismissable metadata pill    | `chip / tag`      |
| numeric unread / update count                | `badge`           |
| inline image (avatar, list leading, channel) | `thumbnail`       |

## Disambiguation cheat sheet

- **Filter chip vs Toggle button**: `chip/filter` for facet selection in a chip row; `button/toggle` for standalone reversible state.
- **Tag chip vs Badge**: `chip/tag` = text metadata; `badge` = numeric count attached to a host.
- **List vs Feed**: same-kind rows → List. Authored content stream → Feed.
- **BottomSheet vs Dialog**: short/actionable/one-thumb → BottomSheet. Confirmation or image-led → Dialog.
- **Callout vs BottomSheet**: in-flow context → Callout. Demands commit before continuing → BottomSheet.
