# Underline

The canonical content-section switcher — a horizontal row of tabs anchored above a panel of content, with a single 2px `onSurface` indicator that slides between the active tab's bottom edge on selection. Use this when moving between *peer panels* of the same surface. For in-place mode changes, reach for [Segmented](./segmented.md).

## Default

The headline form — three peer panels switched by a tab row. The row is **Adaptive** (see [Behavior → Adaptive width](#adaptive-width)).

```preview
tabs/underline/default
---
import { Tabs, Tab } from '@blind-chorus/ui';

<Tabs variant="underline" value="overview" aria-label="Sections">
  <Tab value="overview">Overview</Tab>
  <Tab value="props">Props</Tab>
  <Tab value="examples">Examples</Tab>
</Tabs>
```

## Use cases

### With icon

A leading glyph before the label.

```preview
tabs/underline/leading-icon
---
import { Tabs, Tab } from '@blind-chorus/ui';
import { AddIcon, CheckedIcon } from '@blind-chorus/ui/icons';

<Tabs variant="underline" value="posts" aria-label="Profile sections">
  <Tab value="posts" leadingIcon={<AddIcon />}>Posts</Tab>
  <Tab value="replies">Replies</Tab>
  <Tab value="likes" leadingIcon={<CheckedIcon />}>Likes</Tab>
</Tabs>
```

### Auto-fit

The wider terminal layout of [Adaptive width](#adaptive-width) — tabs share the row's width equally; the indicator widens to match its tab.

```preview
tabs/underline/auto-fit
---
import { Tabs, Tab } from '@blind-chorus/ui';

<Tabs variant="underline" value="feed" aria-label="Sections">
  <Tab value="feed">Feed</Tab>
  <Tab value="channels">Channels</Tab>
  <Tab value="members">Members</Tab>
</Tabs>
```

### Overflow

The narrower terminal layout — tabs hold content width and the row scrolls horizontally. **Edge fade** paints the trailing 48px (`ref.space.600`) as a transparent mask; clears when scrolled to the last tab.

```preview
tabs/underline/overflow
---
import { Tabs, Tab } from '@blind-chorus/ui';

<Tabs variant="underline" value="overview" aria-label="Sections">
  <Tab value="overview">Overview</Tab>
  <Tab value="props">Props</Tab>
  <Tab value="examples">Examples</Tab>
  <Tab value="accessibility">Accessibility</Tab>
  <Tab value="changelog">Changelog</Tab>
  <Tab value="related">Related components</Tab>
  <Tab value="discussion">Discussion</Tab>
</Tabs>
```

### Focus indicator

Static design-review specimen — pins the keyboard-focus ring to the selected tab. See top-level [Focus indicator](#focus-indicator) for composition.

```preview
tabs/underline/focused
---
import { Tabs, Tab } from '@blind-chorus/ui';

<Tabs variant="underline" value="posts" aria-label="Profile">
  <Tab value="posts" state="focused">Posts</Tab>
  <Tab value="replies">Replies</Tab>
  <Tab value="likes">Likes</Tab>
</Tabs>
```

## Slots

- **label** — tab's accessible name. Required, single line.
- **leadingIcon** (optional) — context glyph sized at `sys.icon.md` (16) before the label.

## Anatomy

| Prop / state           | Container          | Label color                           | Indicator                         |
|------------------------|--------------------|---------------------------------------|-----------------------------------|
| **Tab — unselected**   | transparent        | `sys.color.outline` (muted foreground) | none                  |
| **Tab — selected**     | transparent        | `sys.color.onSurface` (strong foreground) | 2px `sys.borderWidth.thin` × `sys.color.onSurface` along the bottom edge — see [Sliding indicator](#sliding-indicator) |
| **Container row**      | transparent, 16px inline padding, 1px `sys.color.outlineVariant` bottom divider running the full row width. Selected indicator paints over this divider. **Edge fade** (rightmost 48px / `ref.space.600`) paints via `mask-image` only while overflow is present. | — | — |

## Sizes

A single fixed rung. The 40px footprint stays constant across breakpoints.

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Container padding (inline)        | 16px                 | `sys.layout.container.md`          |
| Min-height (per tab)              | 40px                 | `ref.space.500` ‡                  |
| Padding (block × inline)          | 8 × 16               | `sys.layout.container.xs` × `sys.layout.container.md` |
| Inter-tab gap                     | 0                    | — †                                |
| Slot gap (icon ↔ label)           | 4px                  | `sys.layout.inline.sm`             |
| Indicator height                  | 2px                  | `sys.borderWidth.thin`              |
| Container bottom divider          | 1px                  | `sys.borderWidth.hairline` × `sys.color.outlineVariant` |
| Label                             | 14 / Semibold        | `sys.typo.label.md`                |
| Icon                              | 16px                 | `sys.icon.md`                      |
| Edge fade width                   | 48px                 | `ref.space.600` — trailing-edge `mask-image`, painted only on overflow |

‡ **min-height** binds to raw `ref.space.*` because `sys.*` does not currently expose a 40px step.

† **Inter-tab gap is `0`** — adjacent tabs sit flush; the visible 32px breathing comes from each tab's 16px inline padding on both sides.

## States

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `selected` | —                          | Label flips to `sys.color.onSurface`; 2px indicator slides to the new tab — see [Sliding indicator](#sliding-indicator). |
| `disabled` | overlay suppressed         | Label at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

**Composition: Inward** (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)) — the row is a horizontal scroller, so an outward ring would clip. The ring paints as inset shadows inside the tab's bounding box, drawn on a `::after` overlay so it sits above the state-overlay tint and underline indicator. Focus never shifts a tab. Trigger: `:focus-visible`.

## Behavior

### Adaptive width

Underline has **one** width mode, not two. The row measures intrinsic tab widths against the container on every layout pass and resolves to one of two terminal layouts:

| Condition                                         | Layout                          | Row overflow      |
|---------------------------------------------------|---------------------------------|-------------------|
| `Σ tab.intrinsicWidth ≤ container.clientWidth`    | **Fit** — tabs share width equally (`flex: 1 1 0`); indicator widens to match. | `visible` — no scroll, no fade. |
| `Σ tab.intrinsicWidth > container.clientWidth`    | **Scroll** — tabs hold content width (`flex: 0 0 auto`); row scrolls horizontally. | `auto` — trailing **Edge fade** paints while content sits past the right edge. |

A `ResizeObserver` re-decides on every container/row resize. Not caller-supplied — the same component adapts to any column without code change. Mode flip is layout-immediate (no animation between modes).

- **No `fullWidth` prop.** A caller sizes the container; the row picks Fit on its own.
- **The indicator width tells the layout** — in Fit it spans the wider tab; in Scroll it spans the content width.

### Sliding indicator

There is **one** indicator in the row, not one per tab. Selecting a different tab slides the existing 2px (`sys.borderWidth.thin`) stroke into the new tab's `offsetLeft` / `offsetWidth` over 220ms — reads as a single continuous gesture.

The indicator scrolls with the row so it stays glued to its tab. On first paint the slide is suppressed. When **Adaptive width** flips between Fit and Scroll, the indicator's width is re-measured (a few dozen pixels reading naturally as "follows its tab").
