# SideSheet

Off-canvas content column anchored to the leading or trailing edge of the viewport. Pairs with [BottomSheet](../bottom-sheet/bottom-sheet.md) as the Sheet family's other anchor: BottomSheet for committed-sheet flows, SideSheet for off-canvas navigation columns, settings panes, channel directories, filter rails.

Composition is free-form via `children` — canonical fill is a [Header](../header/header.md) (`size="medium"`) heading + an embedded [list/entry](../list/entry.md) directory stack (40 avatar + label + inline count Badge + optional trailing icon toggle), optionally followed by another Header + List(entry) pair and a pinned footer commit.

**Reach for this when** an off-canvas column belongs next to the current page — a navigation drawer, a channel / topic / saved-item directory, a filter rail, a settings pane. **Skip when** the surface is a committed-sheet flow (use [BottomSheet](../bottom-sheet/bottom-sheet.md)), a confirmation prompt (use [Dialog](../dialog/dialog.md)), a labelled in-flow block (use [Section](../section/section.md)), or a permanent app-shell navigation (use [TabBar](../tab-bar/tab-bar.md) / [NavigationBar](../navigation-bar/navigation-bar.md)).

**Layout inset.** `bounded-surface` — portal-rendered modal-like surface (same family as `BottomSheet` / `Dialog`). Paints its own off-canvas card, owns the body's gutter, and renders into a `document.body` portal. Compose primitives directly inside `children`; full-bleed children (List, Feed, Banner) negate the body's inline padding via the negative-margin opt-out — see [AGENTS.md § Composition rules](../../../AGENTS.md#composition-rules).

## Default

A left-anchored navigation drawer composed of three Header (medium) + List(entry) directory pairs and a pinned footer commit. The canonical "channels directory" off-canvas pattern.

```preview
side-sheet/default
---
import { Badge, Button, Header, List, SideSheet, SideSheetGroup } from '@blind-dsai/ui';
import { StarFillIcon } from '@blind-dsai/ui/icons';

<SideSheet
  inline
  open
  onClose={() => {}}
  aria-label="Channels drawer"
  footer={
    <Button variant="text" size="small" appearance="accent" onClick={() => {}}>
      Browse all channels
    </Button>
  }
>
  <SideSheetGroup>
    <Header
      size="medium"
      label="My channels"
      headerAction={{ label: '+ Create', onClick: () => {} }}
    />
    <List
      variant="entry"
      embedded
      items={[
        { value: 'team-blind',     label: 'Team Blind',         thumbnail: { alt: 'Team Blind' } },
        { value: 'startup-lounge', label: 'Startup Lounge',     count: <Badge size="small" count={64} />, thumbnail: { alt: 'Startup Lounge' } },
        { value: 'it-pm',          label: 'IT PM · Management', count: <Badge size="small" count={12} />, thumbnail: { alt: 'IT PM · Management' } },
      ]}
    />
  </SideSheetGroup>

  <SideSheetGroup>
    <Header size="medium" label="Favorites" />
    <List
      variant="entry"
      embedded
      items={[
        {
          value: 'sourdough',
          label: 'Sourdough Bakers',
          count: <Badge size="small" count={12} />,
          thumbnail: { alt: 'Sourdough Bakers' },
          trailingIcon: <Button variant="icon" size="medium" aria-label="Favorited" aria-pressed="true" icon={<StarFillIcon />} style={{ color: 'var(--sys-color-icon-yellow)' }} onClick={() => {}} />,
        },
        {
          value: 'stocks',
          label: 'Stocks & Investing',
          count: <Badge size="small" count={142} />,
          thumbnail: { alt: 'Stocks & Investing' },
          trailingIcon: <Button variant="icon" size="medium" aria-label="Favorited" aria-pressed="true" icon={<StarFillIcon />} style={{ color: 'var(--sys-color-icon-yellow)' }} onClick={() => {}} />,
        },
        {
          value: 'movie-talk',
          label: 'Movie Talk',
          count: <Badge size="small" count={24} />,
          thumbnail: { alt: 'Movie Talk' },
          trailingIcon: <Button variant="icon" size="medium" aria-label="Favorited" aria-pressed="true" icon={<StarFillIcon />} style={{ color: 'var(--sys-color-icon-yellow)' }} onClick={() => {}} />,
        },
      ]}
    />
  </SideSheetGroup>

  <SideSheetGroup>
    <Header size="medium" label="Following" />
    <List
      variant="entry"
      embedded
      items={[
        {
          value: 'career',
          label: 'Career & Jobs',
          count: <Badge size="small" count={24} />,
          thumbnail: { alt: 'Career & Jobs' },
          trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" aria-pressed="false" icon={<StarFillIcon />} style={{ color: 'var(--sys-color-icon-muted)' }} onClick={() => {}} />,
        },
        {
          value: 'marketplace',
          label: 'Marketplace',
          count: <Badge size="small" count={12} />,
          thumbnail: { alt: 'Marketplace' },
          trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" aria-pressed="false" icon={<StarFillIcon />} style={{ color: 'var(--sys-color-icon-muted)' }} onClick={() => {}} />,
        },
        {
          value: 'fashion',
          label: 'Fashion & Beauty',
          thumbnail: { alt: 'Fashion & Beauty' },
          trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" aria-pressed="false" icon={<StarFillIcon />} style={{ color: 'var(--sys-color-icon-muted)' }} onClick={() => {}} />,
        },
      ]}
    />
  </SideSheetGroup>
</SideSheet>
```

## Use cases

### Single section

One `SideSheetGroup` with a Header + List(entry) directory. Use for filter rails, settings groups, sub-navigation overlays.

### With pinned commit

Set the `footer` prop with a Text Button to pin a primary commit at the bottom (e.g. "Browse all channels", "Apply filters"). Footer stays flush while the body scrolls.

## Slots

- **scrim** — backdrop. Translucent black (`ref.palette.black.600`); dismisses on tap.
- **card** — off-canvas column. Fixed width, full viewport height, flush against the `anchor` edge. `sys.color.surface` fill + `sys.elevation.sheet` shadow.
- **body** — vertical scroll surface inside the card. Pays `16px inline / 24px block` gutter; stacks children at `24px` (`layout.stack.lg`) — the rhythm **between groups**.
- **group** *(SideSheetGroup)* — bundle of one Header + a directory primitive (canonical: an embedded [list/entry](../list/entry.md) stack) inside the body. Default sibling rhythm `16px` (`layout.stack.md`) so a Header reads attached to the directory below it; the body's `24px` rhythm separates groups. When the directory is a `<List variant="entry">`, the negative-margin opt-out below the body docs auto-applies so the row's leading edge lands flush with the body gutter.
- **footer** *(optional)* — pinned bottom action rail. Single Text Button or compact action node; separated by an `outlineVariant` hairline.

## Trailing favorite-star contract

When a channel / directory row carries a favorite toggle on its trailing edge, use a single fill-only glyph (`StarFillIcon`) whose **colour** communicates the pressed state — never swap between outline (`StarIcon`) and fill (`StarFillIcon`) for the same affordance:

| State    | Icon            | Colour                          | aria-pressed |
|----------|-----------------|---------------------------------|--------------|
| Active   | `StarFillIcon`  | `var(--sys-color-icon-yellow)`  | `true`       |
| Inactive | `StarFillIcon`  | `var(--sys-color-icon-muted)`   | `false`      |

The shape stays constant so the trailing edge has a stable hit-target footprint; only the colour token flips. This is the canonical pattern across Side Sheet, channel lists, directory rows.

## Behavior

- **Portal** — renders into a `document.body` portal when `open` (SSR-safe; target resolves on mount). `inline` mode bypasses the portal for docs previews.
- **Scroll lock** — body scroll is locked while open.
- **Focus** — on open, focus moves to the first focusable inside the card. On close, focus returns to the trigger.
- **Dismiss** — backdrop tap and Escape key both invoke `onClose`. The component never closes itself; consumers own the open state.
- **Full-bleed Lists** — full-bleed children (List, Feed, Banner) rendered as direct children of the body negate the body's inline padding so row leading edges land flush. Same precedent as BottomSheet → overflow / nested-step. Metadata is `inline`, so it tiles flush with the body's gutter without needing the opt-out.

## Forbidden

- `open` without `onClose` — the sheet must own a dismiss path.
- Fixed positioning inside children — the body owns the scroll surface.
- Multiple SideSheets open at once — nest a BottomSheet inside if a sub-step is needed.
- `anchor="top"` / `anchor="bottom"` — top is out of scope; bottom belongs to BottomSheet.
