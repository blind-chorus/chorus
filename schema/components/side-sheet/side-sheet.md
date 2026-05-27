# SideSheet

Off-canvas content column anchored to the leading or trailing edge of the viewport. Pairs with [BottomSheet](../bottom-sheet/bottom-sheet.md) as the Sheet family's other anchor: BottomSheet for committed-sheet flows, SideSheet for off-canvas navigation columns, settings panes, channel directories, filter rails.

Composition is free-form via `children` — canonical fill is a [Header](../header/header.md) (`size="medium"`) heading + a [List](../list/list.md) (`variant="thumbnail"` `density="compact"`) body, optionally followed by another Header + List pair and a pinned footer commit.

**Reach for this when** an off-canvas column belongs next to the current page — a navigation drawer, a channel / topic / saved-item directory, a filter rail, a settings pane. **Skip when** the surface is a committed-sheet flow (use [BottomSheet](../bottom-sheet/bottom-sheet.md)), a confirmation prompt (use [Dialog](../dialog/dialog.md)), a labelled in-flow block (use [Section](../section/section.md)), or a permanent app-shell navigation (use [TabBar](../tab-bar/tab-bar.md) / [NavigationBar](../navigation-bar/navigation-bar.md)).

**Layout inset.** `bounded-surface` — portal-rendered modal-like surface (same family as `BottomSheet` / `Dialog`). Paints its own off-canvas card, owns the body's gutter, and renders into a `document.body` portal. Compose primitives directly inside `children`; full-bleed children (List, Feed, Banner) negate the body's inline padding via the negative-margin opt-out — see [AGENTS.md § Composition rules](../../../AGENTS.md#composition-rules).

## Default

A left-anchored navigation drawer composed of three Header (medium) + List (thumbnail compact) pairs and a pinned footer commit. The canonical "channels directory" off-canvas pattern.

```preview
side-sheet/default
---
import { Badge, Button, Header, List, SideSheet, SideSheetGroup } from '@blind-dsai/ui';
import { PlusIcon, StarIcon, StarFillIcon } from '@blind-dsai/ui/icons';

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
      variant="thumbnail"
      density="compact"
      aria-label="My channels"
      items={[
        { value: 'team',     label: 'Team Blind',         thumbnail: { alt: 'Team Blind' } },
        { value: 'startup',  label: 'Startup Lounge',     thumbnail: { alt: 'Startup Lounge' },     count: <Badge size="small" count={64} /> },
        { value: 'pm',       label: 'IT PM · Management', thumbnail: { alt: 'IT PM · Management' }, count: <Badge size="small" count={12} /> },
      ]}
    />
  </SideSheetGroup>

  <SideSheetGroup>
    <Header size="medium" label="Favorites" />
    <List
      variant="thumbnail"
      density="compact"
      aria-label="Favorite channels"
      items={[
        { value: 'sourdough', label: 'Sourdough Bakers',   thumbnail: { alt: 'Sourdough Bakers' },   count: <Badge size="small" count={12} />,  trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" icon={<StarFillIcon />} onClick={() => {}} /> },
        { value: 'stocks',    label: 'Stocks & Investing', thumbnail: { alt: 'Stocks & Investing' }, count: <Badge size="small" count={142} />, trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" icon={<StarFillIcon />} onClick={() => {}} /> },
        { value: 'movies',    label: 'Movie Talk',         thumbnail: { alt: 'Movie Talk' },         count: <Badge size="small" count={24} />,  trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" icon={<StarFillIcon />} onClick={() => {}} /> },
      ]}
    />
  </SideSheetGroup>

  <SideSheetGroup>
    <Header size="medium" label="Following" />
    <List
      variant="thumbnail"
      density="compact"
      aria-label="Following channels"
      items={[
        { value: 'career', label: 'Career & Jobs',    thumbnail: { alt: 'Career & Jobs' },    count: <Badge size="small" count={24} />, trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" icon={<StarIcon />} onClick={() => {}} /> },
        { value: 'market', label: 'Marketplace',      thumbnail: { alt: 'Marketplace' },      count: <Badge size="small" count={12} />, trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" icon={<StarIcon />} onClick={() => {}} /> },
        { value: 'beauty', label: 'Fashion & Beauty', thumbnail: { alt: 'Fashion & Beauty' },                                            trailingIcon: <Button variant="icon" size="medium" aria-label="Favorite" icon={<StarIcon />} onClick={() => {}} /> },
      ]}
    />
  </SideSheetGroup>
</SideSheet>
```

## Use cases

### Single section

One `SideSheetGroup` with a Header + List. Use for filter rails, settings groups, sub-navigation overlays.

### With pinned commit

Set the `footer` prop with a Text Button to pin a primary commit at the bottom (e.g. "Browse all channels", "Apply filters"). Footer stays flush while the body scrolls.

## Slots

- **scrim** — backdrop. Translucent black (`ref.palette.black.600`); dismisses on tap.
- **card** — off-canvas column. Fixed width, full viewport height, flush against the `anchor` edge. `sys.color.surface` fill + `sys.elevation.sheet` shadow.
- **body** — vertical scroll surface inside the card. Pays `16px inline / 24px block` gutter; stacks children at `24px` (`layout.stack.lg`) — the rhythm **between groups**.
- **group** *(SideSheetGroup)* — bundle of one Header + one (or more) List inside the body. Internal gap `16px` (`layout.stack.md`); the body's `24px` rhythm separates groups.
- **footer** *(optional)* — pinned bottom action rail. Single Text Button or compact action node; separated by an `outlineVariant` hairline.

## Behavior

- **Portal** — renders into a `document.body` portal when `open` (SSR-safe; target resolves on mount). `inline` mode bypasses the portal for docs previews.
- **Scroll lock** — body scroll is locked while open.
- **Focus** — on open, focus moves to the first focusable inside the card. On close, focus returns to the trigger.
- **Dismiss** — backdrop tap and Escape key both invoke `onClose`. The component never closes itself; consumers own the open state.
- **Full-bleed Lists** — Lists rendered as direct children of the body negate the body's inline padding so row leading edges land flush. Same precedent as BottomSheet → overflow / nested-step.

## Forbidden

- `open` without `onClose` — the sheet must own a dismiss path.
- Fixed positioning inside children — the body owns the scroll surface.
- Multiple SideSheets open at once — nest a BottomSheet inside if a sub-step is needed.
- `anchor="top"` / `anchor="bottom"` — top is out of scope; bottom belongs to BottomSheet.
