# Catalog — intent → component

Reverse index from natural-language intent to family + sub-component. Read *before* opening any spec to narrow candidates. Authoritative shape lives in `schema/components/<family>/<sub>.spec.json`; this file is a routing layer.

## How intent binding works

Each family declares `visualReuse: "open" | "locked"` in its `<family>.family.json`. The catalog respects that flag.

- **Open (default, 14 families)** — `badge`, `banner`, `button`, `suggestion-list`, `avatar-rail`, `chip`, `feed`, `list`, `navigation-bar`, `profile-header`, `section`, `tab-bar`, `tabs`, `thumbnail`. The intent table is the *first* suggestion, but the agent MAY reach for these on visual-fit grounds even when the brief's intent does not match the row verbatim — e.g. `<Feed>` as a generic article-card surface, `<Banner>` as a tonal aside outside a literal "notice", `<Section>` as any labelled editorial block. Anatomy invariants (slot grammar, token bindings, intrinsic geometry) still apply.
- **Locked (5 families)** — `dialog`, `bottom-sheet`, `toast`, `tooltip`, `form-field`. MUST only be used when the brief's intent matches a row. Their contract IS the interaction — focus trap, auto-dismiss, ARIA live region, form semantics, hover/focus trigger. Borrowing the visual shape without the role breaks behavior. Marked *(locked)* below.

When in doubt: open families are recipes, locked families are rules.

## Top bars

**Layout**: every entry is `layoutInset: full-bleed` — direct child of `<main>`, no wrapper `padding-inline`.

| Intent                                | Family + sub                       |
| ------------------------------------- | ---------------------------------- |
| landing screen header, title bar      | `navigation-bar / home`            |
| drill-in screen header, back + title  | `navigation-bar / page`            |
| search screen header, input fills bar | `navigation-bar / search`          |
| profile / channel detail page identity (cover + avatar + name + follow) | `profile-header` |

**Disambiguate**: never stack two NavigationBars. Pick by *screen kind*, not *content kind*. `profile-header` is not a bar — it's the page-level identity block (cover, avatar, name, follow) at the top of a profile detail route; pair it with a transparent overlay `navigation-bar / page` when the route is a drill-in.

## Action commits

**Layout**: every entry is `layoutInset: inline` — an atom that needs grouping (action row, toolbar, button group) to sit at page level. Exception: `button / fab` is viewport-anchored fixed-position chrome and lives outside the page's normal stack.

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

**Layout**: every entry is `layoutInset: full-bleed` — direct child of `<main>`, no wrapper `padding-inline`. When nested inside `<Section>` / `<Feed>` (another full-bleed host that pays its own chrome), pass `embedded` so background + padding defer to the host — see [`AGENTS.md` § Composition rules](../AGENTS.md#composition-rules).

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

**Disambiguate**: `feed` = authored content (author, body, footer). `list` = menus/settings/pickers (stacked rows, hairline divider). `nav-card` = a SINGLE drill-in row as its own bounded outlined card — reach for it when one drill-in needs to read as its own affordance, not one entry in a stack. `accordion` = stacked rows that EXPAND in place rather than drill-in — for short content the user opens to read (FAQ, T&C, expandable filter). `suggestion-list` = labelled swipeable block of follow-suggestions (channels, people, companies, topics — same anatomy).

## Horizontal content surfaces

**Layout**: every entry is `layoutInset: full-bleed` — direct child of `<main>`, no wrapper `padding-inline`. When nested inside `<Section>` / `<Feed>`, pass `embedded` so chrome defers to the host — see [`AGENTS.md` § Composition rules](../AGENTS.md#composition-rules).

| Intent                                  | Family + sub             |
| --------------------------------------- | ------------------------ |
| compact horizontal entity quick-nav      | `avatar-rail`           |
| section tabs with sliding indicator     | `tabs / underline`       |
| chip-shaped tab row with leading icons  | `tabs / rounded`         |
| in-place mode toggle (List ↔ Grid)      | `tabs / segmented`       |

## Modal surfaces

**Layout**: mixed — column below. `bounded-surface` floats *above* the page (portal-mounted, viewport-anchored, owns its safe area). `banner` is the outlier — it's `full-bleed` and lives **in** the content column, not above it; it's listed here only because it's the in-flow alternative to a modal prompt.

| Intent                                              | Family + sub                                                | layoutInset       |
| --------------------------------------------------- | ----------------------------------------------------------- | ----------------- |
| short focused commit anchored to bottom of viewport | `bottom-sheet` *(locked)*                                   | `bounded-surface` |
| confirmation prompt, centered                       | `dialog` *(locked)*                                         | `bounded-surface` |
| destructive confirmation                            | `dialog` *(locked)* with destructive primary action         | `bounded-surface` |
| inline notice inside the content column             | `banner / accent` or `/ default` (not modal — in-flow aside)| **`full-bleed`** ⚠ |
| transient post-action confirmation (saved, copied)  | `toast` *(locked)* — non-modal, auto-dismiss                | `bounded-surface` |
| trigger-anchored hint over a hovered/focused control | `tooltip` *(locked)* — non-modal, hover/focus-driven       | `bounded-surface` |

**Disambiguate**: `bottom-sheet`/`dialog` are modal — require a trigger elsewhere. `banner` is not modal; lives in the content column. `toast` is non-modal and self-dismissing — reach for it only when the action has landed and no decision is needed. `tooltip` is non-modal and floats over a specific trigger — only when the message describes a hovered/focused control.

## Inputs

**Layout**: every entry in the table below is `layoutInset: inline` — `<FormField>` wraps inline within a form column. The Search sub-table further down mixes layouts (NavBar vs FormField).

| Intent                                | Family + sub               |
| ------------------------------------- | -------------------------- |
| labeled single-line text field        | `form-field / input` *(locked)* |
| bare pill search input                | `form-field / search` *(locked)* |

**Disambiguate**: `form-field` is *(locked)* — only for real text entry. For an Input-shaped read-only display row, reach for a `list / text` row or a token-faithful primitive rather than borrowing the form-field shell (the `<input>` semantics, label binding, and a11y plumbing would lie).

### Search affordance — three candidates, pick by surface

"Search" maps to three different Chorus rungs by where the field sits. Do NOT default to the first that comes to mind — and do NOT fall back to a hand-rolled `<input>`. All three exist and are typed in `dist/index.d.ts`:

| Surface (where the field lives)                                | Component                                            | layoutInset    | Why                                                                                                                          |
| -------------------------------------------------------------- | ---------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Top bar takes the whole row** (search mode of a screen)       | `<NavigationBar variant="search">`                   | `full-bleed`   | The bar IS the field. Owns back chevron + bare input + clear button as one chrome unit. Use when entering "search mode" of a screen. |
| **Inline filter / list-top / sheet-top** (chrome, not a form)   | `<FormField variant="search">`                       | `inline`       | The bare pill — leading magnifier glyph, focus-only clear button, no label / helper / maxLength. The affordance is the glyph. |
| **Inside a real form** (search-shaped input that needs a label) | `<FormField variant="input" leadingIcon={<SearchIcon/>} label="…" helper="…">` | `inline` | Use when the field needs a visible label, helper text, error appearance, or character count — `search` has none of those.    |

Each row resolves to a typed React component — `<FormField variant="search" placeholder="…" onChange={…}>` autocompletes from `dist/index.d.ts`. IDE shows `ComponentType<any>`? You're reading a stale shim — delete it and re-resolve.

## Compact controls

**Layout**: every entry is `layoutInset: inline` — sits inside another component's slot (List leading, Banner trailing, Feed footer, Thumbnail corner), never at page level on its own.

| Intent                                       | Family + sub      |
| -------------------------------------------- | ----------------- |
| toggle chip for facet selection              | `chip / filter`   |
| informational / dismissable metadata pill    | `chip / tag`      |
| numeric unread / update count                | `badge`           |
| inline image (avatar, list leading, channel) | `thumbnail`       |
| instant-commit on/off toggle                 | `switch`          |
| inline status mark next to a row label       | `status-tag`      |

**Disambiguate**: `switch` = single binary on/off that commits the moment it flips (notifications, privacy). For multi-option pickers use `list / radio`; for actions needing confirmation use `button` + `dialog`; for "selected" facet state in a chip row use `chip / filter`. `status-tag` = SMALL (16-rung, 10px text) decorative status pill inline next to a row label — "pending", "rejected", "draft". For a 32-rung interactive chip use `chip / tag`; for a numeric count attached to an icon/thumbnail use `badge`.

## Loading & placeholder

**Layout**: every entry is `layoutInset: inline` — placed where the real content will land, taking the slot's footprint.

| Intent                                                | Family + sub          |
| ----------------------------------------------------- | --------------------- |
| in-flight content placeholder (mirrors content shape) | `skeleton`            |
| linear progress for a known long-running task          | `progress`            |

**Disambiguate**: `skeleton` = *in-flight* tonal block previewing where content will land. For loading data the host would otherwise paint as empty. NOT for empty states (no data yet) — those use illustration + body copy. `progress` = slim track for a *long-running, identifiable* task (upload, onboarding step, background sync). Use `indeterminate` when busy without a known ratio. For sub-300ms waits use neither.

## Shadcn / Lovable name translation

When an AI agent (or designer paging in from shadcn) reaches for a shadcn-named component, this is the Chorus surface to render. Direct React `export` aliases live in `packages/ui/src/index.js` where the name doesn't already collide (`Sheet`, `Drawer`, `Alert`, `Avatar`, `AppBar`, `BottomNav`); the table below covers the rest — including where Chorus splits one shadcn shape into multiple intent-bound surfaces.

| Shadcn / Lovable name              | Chorus surface to render                                                            | Notes |
|-----------------------------------|------------------------------------------------------------------------------------|-------|
| `<Alert variant="default">`        | `<Banner appearance="default">`                                                     | Already aliased — `import { Alert } from '@blind-dsai/ui'`. |
| `<Alert variant="destructive">`    | `<Banner appearance="destructive">`                                                 | Use the destructive appearance. |
| `<AlertDialog>` (confirm prompt)   | `<Dialog>`                                                                          | Same locked modal-confirmation contract (focus trap, primary/secondary actions). |
| `<Badge variant="…">` *(text pill)* | `<StatusTag appearance="neutral \| error">`                                          | Chorus `Badge` is a numeric/dot count marker — same name, different intent. Text-pill `<Badge>` calls translate to `StatusTag`. |
| `<Avatar>` (image+fallback compound) | `<Thumbnail src=… alt=… />`                                                         | Already aliased. Use Thumbnail's `imageFallbackImage` / `imageFallbackText` props instead of the `<AvatarFallback>` child. |
| `<Card>` (generic bordered block)  | One of: `<Section>` (labelled editorial block), `<Feed>` (authored content), `<NavCard>` (drill-in row), `<Banner>` (tonal aside) | Chorus splits "Card" by intent — pick by what the block carries, not by the chrome. |
| `<Carousel>`                       | `<PostCarousel>` (cards) or `<ProfileCarousel>` (avatar-anchored)                   | Pick by content rung. |
| `<Checkbox>` (single)              | `<Button variant="check">`                                                          | Chorus `Button` `check` sub IS the checkbox — leading 24px checkbox glyph + label. List-row multi-select uses `<Chip variant="filter">`. |
| `<Command>` (command palette)      | `<FormField variant="search">` + `<BottomSheet>` + `<List>` pattern                 | Composition, not a single primitive. Mobile-first translation of the desktop command palette. |
| `<ContextMenu>` (right-click menu) | `<BottomSheet>` with a `List`                                                       | Same as `<DropdownMenu>` — right-click on mobile becomes a one-thumb sheet. |
| `<DropdownMenu>` (floating menu)   | `<BottomSheet>` with a `List`                                                       | Mobile-first — floating menus collide with one-thumb reach. |
| `<HoverCard>` / `<Popover>`        | `<Tooltip>` (short text) or `<BottomSheet>` (multi-line / actionable)               | Hover-anchored surfaces don't translate to mobile. |
| `<Label>` (standalone form label)  | `<FormField>`'s `label` slot                                                        | No standalone `<Label>`. Every input label lives on its host `<FormField>` via the `label` prop — keeps label/field/helper triplet locked. For non-input labels (settings group title, drawer column heading), use `<Header size="medium">`. |
| `<NavigationMenu>` (top-level nav) | `<NavigationBar>` (page chrome) / `<TabBar>` (bottom app nav) / `<NavCard>` (drill-in row) | Chorus splits "navigation" by surface role. |
| `<RadioGroup>` + `<RadioGroupItem>` | `<List variant="radio" items={[…]} onChange=… />`                                    | Chorus's only radio surface IS the list row. |
| `<Separator>` (horizontal rule)    | None — built into the host (`List` row divider, `Section` block gap, `BottomSheet` action rail border) | No standalone separator. Vertical rhythm comes from `sys.layout.stack.*`; horizontal rules come from the host's anatomy. Do NOT introduce a `<Separator>` — flag a "Chorus gap". |
| `<Sheet side="bottom">`            | `<BottomSheet>`                                                                     | Aliased. |
| `<Sheet side="left">` / `<Sheet side="right">` | `<SideSheet anchor="left">` / `<SideSheet anchor="right">`              | Off-canvas navigation drawer / side panel. Compose with `Header` (medium) + `List` (thumbnail, compact) inside `SideSheetGroup`. Aliased — `import { SideDrawer } from '@blind-dsai/ui'`. Top is out of scope. |
| `<Sidebar>` (off-canvas app nav)   | `<SideSheet anchor="left">`                                                         | Desktop persistent sidebar becomes the off-canvas drawer. Compose with `SideSheetGroup` (Header + List compact) for the channel-directory shape. |
| `<Sonner>` / `toast()` imperative  | `<Toast>` declarative                                                               | Chorus toast is declarative — render `<Toast>` from the host; no imperative `toast()` call. |
| `<ToggleGroup type="single">`      | `<Tabs variant="segmented">`                                                        | In-place mode toggle. |
| `<ToggleGroup type="multiple">`    | A row of `<Chip variant="filter">`                                                  | Multi-select facet selection. |

### Chorus gaps — flag, do not improvise

These shadcn primitives have no Chorus equivalent and no on-pattern mobile substitution. When a brief demands one, **stop and flag a "Chorus gap"** — do NOT improvise a wrapper, re-introduce shadcn, or hardcode raw values. Maintainers add the missing family; agents wait or work around.

| Shadcn / Lovable name | Mobile use case (when it WOULD be needed) | Status |
|-----------------------|--------------------------------------------|--------|
| `<Calendar>` (date picker) | Birthday, schedule, calendar event picker.    | **Gap**. Workaround: pair `<FormField variant="select">` with native `<input type="date">` inside a `<BottomSheet>`; flag the gap. |
| `<Chart>` (data viz)    | Analytics, finance, fitness charts.            | **Gap**. Workaround: external `recharts`/`chart.js`, but every color/typography MUST resolve through Chorus tokens (`var(--sys-*)`); flag the gap. |
| `<Slider>` (range)      | Price-range filter, volume/brightness.        | **Gap**. Workaround: native `<input type="range">` styled via tokens; flag the gap. |
| `<InputOTP>` (OTP code) | Verification code entry (auth flows).         | **Gap**. Workaround: row of `<FormField variant="input">` with `maxLength=1`; flag the gap. |

### Out of mobile scope — substitute the mobile pattern

These shadcn primitives are desktop-first or web-OS conventions Chorus deliberately omits because the mobile equivalent is a different shape. Agents MUST substitute the listed pattern instead of re-introducing the shadcn primitive.

| Shadcn / Lovable name | Out of scope because | Mobile substitute |
|-----------------------|----------------------|--------------------|
| `<Breadcrumb>`        | Mobile is deep-link / drill-in; no horizontal trail.            | `<NavigationBar variant="page">` (back + title). |
| `<Menubar>`           | Persistent app menubar is desktop chrome.                       | `<NavigationBar>` for top chrome + `<BottomSheet>` for action overflow. |
| `<Pagination>`        | Mobile feeds are infinite-scroll, not paged.                              | Infinite scroll inside `<Feed>` / `<List>` (consumer wires the loader). |
| `<Resizable>`         | Adjustable split panels are desktop.                         | None — single-pane mobile layout. Flag a "Chorus gap" if a tablet split view is required. |
| `<Table>` (data grid) | Wide rows don't fit one-thumb column.                                   | `<List variant="thumbnail">` or `<Feed>` rows. For tabular data, render one row per item with `label` + `supportingText`. |
| `<ScrollArea>`        | Custom-styled scrollbars fight native mobile scroll.                       | Native scroll on the host element. Do NOT introduce a styled track. |

## Disambiguation cheat sheet

*First-pass* defaults for open families; *hard rules* for locked families.

- **Filter chip vs Toggle button** (both open): `chip/filter` for facet selection in a chip row; `button/toggle` for standalone reversible state. Either visual shape may be reused outside canonical intent.
- **Tag chip vs Badge vs StatusTag** (open): `chip/tag` = 32-rung selectable text metadata; `badge` = numeric count/dot attached to a host icon or thumbnail; `status-tag` = 16-rung decorative inline status pill next to a row label.
- **List vs Feed** (both open): same-kind rows → List, authored content stream → Feed *as default*. Either may be reused for a different content shape — e.g. a `Feed`-style card hosting a non-post summary, or a `List` row hosting an editorial item.
- **BottomSheet vs Dialog** (both locked): short/actionable/one-thumb → BottomSheet; confirmation or image-led → Dialog. **Never** borrow either for non-modal — dismiss/focus contracts are the point.
- **Banner vs BottomSheet**: in-flow context → `banner` (open, reusable as a generic tonal block). Demands a commit before continuing → `bottom-sheet` *(locked)*.
- **Toast vs Tooltip vs Banner**: all three describe "short message", but `toast` *(locked)* is auto-dismissing and `tooltip` *(locked)* is trigger-anchored — visual reuse outside those roles is forbidden. For a static "small message" in the reading flow, reach for `banner` (open).
- **Skeleton vs Progress**: `skeleton` previews *where content will land* (placeholder that swaps out atomically). `progress` shows *how far a task has advanced* (value-bound or busy indicator). Sub-300ms waits: neither.
