# Underline

The canonical content-section switcher — a row of tabs anchored above a panel, with a 2px `onSurface` indicator that slides along the active tab's bottom edge.

**Reach for this when** moving between peer panels of the same surface. **Skip when** the row is an in-place mode change — use [Segmented](./segmented.md) instead.

**Layout inset.** full-bleed — edge-to-edge family. Sits as a direct child of the page shell so the indicator travels between page edges; the row pays its own 16px inline padding via `layout.container.*` — do **not** wrap it in another padding div, or the page rail double-pays. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

Headline form — three peer panels switched by a tab row. Adaptive width (see [Behavior](#behavior)).

```preview
tabs/underline/default
---
import { Tabs, Tab } from '@blind-dsai/ui';

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
import { Tabs, Tab } from '@blind-dsai/ui';
import { PlusIcon, CheckedIcon } from '@blind-dsai/ui/icons';

<Tabs variant="underline" value="posts" aria-label="Profile sections">
  <Tab value="posts" leadingIcon={<PlusIcon />}>Posts</Tab>
  <Tab value="replies">Replies</Tab>
  <Tab value="likes" leadingIcon={<CheckedIcon />}>Likes</Tab>
</Tabs>
```

### Auto-fit

Wider terminal layout of Adaptive width — tabs share row width equally; indicator widens to match.

```preview
tabs/underline/auto-fit
---
import { Tabs, Tab } from '@blind-dsai/ui';

<Tabs variant="underline" value="feed" aria-label="Sections">
  <Tab value="feed">Feed</Tab>
  <Tab value="channels">Channels</Tab>
  <Tab value="members">Members</Tab>
</Tabs>
```

### Overflow

Narrower terminal layout — tabs hold content width and the row scrolls. The trailing 48px (`ref.space.600`) paints as a transparent `mask-image` edge fade; clears when scrolled to the last tab.

```preview
tabs/underline/overflow
---
import { Tabs, Tab } from '@blind-dsai/ui';

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

Static specimen — pins the keyboard-focus ring to the selected tab. See top-level [Focus indicator](#focus-indicator).

```preview
tabs/underline/focused
---
import { Tabs, Tab } from '@blind-dsai/ui';

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
| **Tab — selected**     | transparent        | `sys.color.onSurface` (strong foreground) | 2px `sys.borderWidth.thin` × `sys.color.onSurface` along the bottom edge |
| **Container row**      | transparent, 16px inline padding, 1px `sys.color.outlineVariant` bottom divider running the full row width. Selected indicator paints over this divider. Edge fade (rightmost 48px / `ref.space.600`) paints via `mask-image` only while overflow is present. | — | — |

## Sizes

A single fixed rung — the 40px footprint stays constant across breakpoints.

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
| Edge fade width                   | 48px                 | `ref.space.600` — trailing `mask-image`, on overflow only |

‡ `min-height` binds raw `ref.space.*` — `sys.*` does not currently expose a 40px step.

† Adjacent tabs sit flush; the visible 32px breathing comes from each tab's 16px inline padding on both sides.

## States

| State      | Overlay opacity            | Additional                                                                 |
|------------|----------------------------|-----------------------------------------------------------------------------|
| `default`  | —                          | Container + label at rest.                                                  |
| `hovered`  | `sys.state.hover` (8%)     | Pointer-driven via `:hover`.                                                |
| `pressed`  | `sys.state.pressed` (16%)  | Pointer-driven via `:active`.                                               |
| `selected` | —                          | Label flips to `sys.color.onSurface`; 2px indicator slides to the new tab.   |
| `disabled` | overlay suppressed         | Label at `sys.state.disabled` (40%) opacity, focus ring suppressed, `cursor: not-allowed`. |

## Focus indicator

**Composition: Inward** — row is a horizontal scroller, so an outward ring would clip. Paints as inset shadows inside the tab's bounding box on a `::after` overlay above the state-overlay tint and underline indicator. Focus never shifts a tab. Trigger: `:focus-visible`. See [Focus ring composition](../../DESIGN.md#focus-ring-composition).

## Behavior

- **Adaptive width.** One width mode — the row measures intrinsic tab widths against the container on every layout pass via `ResizeObserver`. If `Σ tab.intrinsicWidth ≤ container.clientWidth`, tabs share width equally (`flex: 1 1 0`) and the indicator widens to match; otherwise tabs hold content width (`flex: 0 0 auto`) and the row scrolls with the trailing edge fade. Mode flip is layout-immediate (no animation). No `fullWidth` prop — caller sizes the container; row picks Fit on its own.
- **Sliding indicator.** One indicator in the row, not one per tab. Selecting a different tab slides the 2px (`sys.borderWidth.thin`) stroke into the new tab's `offsetLeft` / `offsetWidth` over 220ms — reads as a single continuous gesture. The indicator scrolls with the row so it stays glued to its tab; on first paint the slide is suppressed; when Adaptive width flips between Fit and Scroll, the indicator's width is re-measured.
