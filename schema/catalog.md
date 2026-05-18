# Catalog — intent → component

Reverse index from natural-language intent to family + sub-component. Agents read this *before* opening any spec, to narrow down which families are candidates for a given request. The authoritative shape of each component still lives in `schema/components/<family>/<sub>.spec.json` — this file is just a routing layer.

When a request mentions one of the keywords below, prefer the family on the right. When unsure between two families, follow the disambiguation line.

## Top bars

| Intent                                | Family + sub                       |
| ------------------------------------- | ---------------------------------- |
| landing screen header, title bar      | `navigation-bar / home`            |
| drill-in screen header, back + title  | `navigation-bar / page`            |
| search screen header, input fills bar | `navigation-bar / search`          |

**Disambiguate**: never stack two NavigationBars on one screen. Pick the variant that matches the *screen kind*, not the *content kind*.

## Action commits

| Intent                                     | Family + sub                  |
| ------------------------------------------ | ----------------------------- |
| primary inline commit (Save, Continue)     | `button / standard`    |
| canonical floating commit (Compose, New)   | `button / fab`                |
| icon-only inline commit                    | `button / icon`        |
| link-shaped commit, low emphasis           | `button / text`        |
| reversible state (mute / unmute, follow)   | `button / toggle`      |
| dense action inside a toolbar              | `button / toolbar`     |
| destructive primary commit                 | `button / standard` with `flavor: "destructive"` (inside a Dialog) |

**Disambiguate**: FAB is reserved for the **single** canonical commit of a screen. Destructive primary commits go inside a `dialog` / `bottom-sheet`, not on a FAB.

## Vertical content surfaces

| Intent                                       | Family + sub             |
| -------------------------------------------- | ------------------------ |
| settings / menu / picker rows                | `list / text` or `/ nav` |
| single-select option group                   | `list / radio`           |
| avatar-anchored rows (channels, DMs)         | `list / thumbnail`       |
| drill-in rows with trailing chevron          | `list / nav`             |
| authored content stream (posts, comments)    | `feed / feed`            |
| channel directory                            | `channel-list`           |

**Disambiguate**: `feed` is for authored content (author, body, footer). `list` is for menus / settings / pickers. `channel-list` is specifically a channel directory — do not generalize it to other domains.

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

**Disambiguate**: `bottom-sheet` and `dialog` are modal — they require a triggering action elsewhere on the screen. `callout` is *not* modal; it lives in the content column.

## Inputs

| Intent                                | Family + sub               |
| ------------------------------------- | -------------------------- |
| labeled single-line text field        | `form-field / input`       |
| bare pill search input                 | `form-field / search`  |

**Disambiguate**: if the search input fills the entire top bar, use `navigation-bar / search` instead of dropping a `search` into a `home` NavigationBar.

## Compact controls

| Intent                                       | Family + sub      |
| -------------------------------------------- | ----------------- |
| toggle chip for facet selection              | `chip / filter`   |
| informational / dismissable metadata pill    | `chip / tag`      |
| numeric unread / update count                | `badge`           |
| inline image (avatar, list leading, channel) | `thumbnail`       |

## Disambiguation cheat sheet

- **Filter chip vs Toggle button**: `chip/filter` for facet selection inside a chip row; `button/toggle` for a standalone reversible state (mute, follow).
- **Tag chip vs Badge**: `chip/tag` is text-bearing metadata; `badge` is a numeric count attached to a host.
- **List vs Feed**: rows of *the same kind* of thing (menus, channels, options) → List. Stream of *authored content* → Feed.
- **BottomSheet vs Dialog**: short / actionable / one-thumb reach → BottomSheet. Confirmation or image-led prompt → Dialog.
- **Callout vs BottomSheet**: in-flow context → Callout. Demands a commit before continuing → BottomSheet.
