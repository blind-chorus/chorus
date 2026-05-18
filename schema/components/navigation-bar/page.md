# Page

The drill-in top bar — anchored to every screen one step inside a flow. The page name sits centred; a leading slot (typically a back-arrow icon) and a trailing slot (a [Toolbar Button](../button/toolbar.md), text link, or single icon) flank it. Title type drops from Home's `typo.heading.lg` to `typo.heading.sm` (16/Semibold).

## Default

A drill-in bar with back-arrow leading and a **primary**-toned "Save" [Toolbar Button](../button/toolbar.md) trailing.

```preview
navigation-bar/page/default
---
import { NavigationBar, Button } from '@blind-chorus/ui';

<NavigationBar
  variant="page"
  title="Edit profile"
  leading={{ icon: <BackwardIcon />, 'aria-label': 'Back' }}
  trailing={<Button variant="toolbar" appearance="primary">Save</Button>}
/>
```

## Use cases

### With icon trailing

The trailing slot carries a single icon.

```preview
navigation-bar/page/icon-trailing
---
import { NavigationBar } from '@blind-chorus/ui';

<NavigationBar
  variant="page"
  title="Thread"
  leading={{ icon: <BackwardIcon />, 'aria-label': 'Back' }}
  trailing={{ icon: <MoreIcon />, 'aria-label': 'More' }}
/>
```

### With Text Button trailing

The trailing slot carries a [Text Button](../button/text.md) — typically a "Skip" affordance or "Done" commit. Reads as inline 16/Semibold `primary` type at rest.

```preview
navigation-bar/page/link-trailing
---
import { NavigationBar } from '@blind-chorus/ui';

<NavigationBar
  variant="page"
  title="Pick your interests"
  leading={{ icon: <BackwardIcon />, 'aria-label': 'Back' }}
  trailing={{ label: 'Skip', href: '#skip' }}
/>
```

### External page (close-only)

For external content visited in-app (embedded webview, in-app browser). Leading drops because there's no flow to step back through; trailing collapses to a single close (×) [Icon Button](../button/icon.md) with `aria-label="Close"`.

```preview
navigation-bar/page/external-page
---
import { NavigationBar } from '@blind-chorus/ui';

<NavigationBar
  variant="page"
  title="Help center"
  trailing={{ icon: <CloseIcon />, 'aria-label': 'Close' }}
/>
```

### Title only

Both side slots empty — for non-dismissible sub-pages (forced confirmation, terms gate).

```preview
navigation-bar/page/title-only
---
import { NavigationBar } from '@blind-chorus/ui';

<NavigationBar
  variant="page"
  title="Terms of service"
/>
```

## Slots

- **leading** (optional) — typically a 24px back-arrow icon, rendered as a transparent icon capsule.
- **title** — page's name. Required, single line, `typo.heading.sm` (16/Semibold) `onSurface`, centred. Ellipsis on narrow.
- **trailing** (optional) — exactly one affordance. Three accepted shapes:
  1. A single 24px icon (transparent capsule).
  2. A [Toolbar Button](../button/toolbar.md) with a label — "Save", "Done", "Edit".
  3. A [Text Button](../button/text.md) — `primary`-coloured 16/Semibold inline action sized at `typo.heading.sm`.

## Anatomy

| Slot                  | Container          | Color                                   |
|-----------------------|--------------------|------------------------------------------|
| **Bar container**     | `sys.color.surface` fill, 8px block / 16px inline padding, no border, no shadow at rest. | — |
| **Leading**           | Transparent icon capsule (8 padding around 24px glyph). | `sys.color.onSurface` |
| **Title**             | Plain text, centred horizontally — not interactive. | `sys.color.onSurface` |
| **Trailing**          | Transparent icon capsule, [Toolbar Button](../button/toolbar.md), or [Text Button](../button/text.md). | `sys.color.onSurface` (icon / Toolbar) or `sys.color.primary` (Text Button) |

## Sizes

A single fixed rung.

| Property                          | Value                | Token                              |
|-----------------------------------|----------------------|-------------------------------------|
| Container padding (block × inline)| 8 × 16               | `sys.layout.container.xs` × `sys.layout.container.md` |
| Min-height                        | 56px                 | raw — matches Home ‡               |
| Slot gap (between slots)          | 16px                 | `sys.layout.inline.xl`             |
| Icon-capsule padding              | 8px                  | `sys.layout.container.xs`          |
| Title                             | 16 / Semibold        | `sys.typo.heading.sm`              |
| Leading icon                      | 24px                 | `sys.icon.lg`                      |
| Trailing icon                     | 24px                 | `sys.icon.lg`                      |

‡ Same 56 footprint as Home — keeps bar height constant across a flow. Natural height 8 + 40 + 8 = 56.

## Layout

Three-column grid (leading / title / trailing) sized **`1fr auto 1fr`** — equal side regions, so the centre `auto` column always sits at the bar's geometric horizontal centre regardless of side-slot widths. The trailing column collapses to zero when empty — a leading-only or title-only bar centres on the same axis. Action always stays intact; title truncation is the safety net.

## States

The bar has no interactive state. Side slots inherit the recipe of whichever control they host — [Icon Button](../button/icon.md), [Toolbar Button](../button/toolbar.md), or [Text Button](../button/text.md). Title carries no states.

## Focus indicator

Bar isn't a focus target; side slots inherit each control's own focus composition. Trigger: `:focus-visible`.

## Behavior

- **Title centring.** `1fr auto 1fr` pins the title to the geometric centre — neither side slot can push it off-axis.
- **Title truncation.** Long names truncate with ellipsis; bar never grows past 56px. Safety net only.
- **Back affordance.** Leading slot is conventionally back-arrow; host wires `onClick` to the framework's back action.
