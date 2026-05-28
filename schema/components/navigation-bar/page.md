# Page

The drill-in top bar — anchored to every screen one step inside a flow. The page name sits centred; a leading slot (typically a back-arrow icon) and a trailing slot (a [Toolbar Button](../button/toolbar.md), text link, or single icon) flank it. Title type drops from Home's `typo.heading.lg` to `typo.heading.sm` (16/Semibold).

**Layout inset.** `full-bleed` — sits as a direct child of the page shell at the top of the route. The bar pays its own `16px inline / 8px block` padding via `layout.container.*`; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Default

A drill-in bar with back-arrow leading and a **primary**-toned "Save" [Toolbar Button](../button/toolbar.md) trailing.

```preview
navigation-bar/page/default
---
import { NavigationBar, Button } from '@blind-dsai/ui';

<NavigationBar
  variant="page"
  title="Edit profile"
  leading={{ icon: <ChevronLeftIcon />, 'aria-label': 'Back' }}
  trailing={<Button variant="toolbar" appearance="accent">Save</Button>}
/>
```

## Use cases

### With icon trailing

The trailing slot carries a single icon.

```preview
navigation-bar/page/icon-trailing
---
import { NavigationBar } from '@blind-dsai/ui';

<NavigationBar
  variant="page"
  title="Thread"
  leading={{ icon: <ChevronLeftIcon />, 'aria-label': 'Back' }}
  trailing={{ icon: <EllipsisHorizontalIcon />, 'aria-label': 'More' }}
/>
```

### With text button trailing

The trailing slot carries a [Text Button](../button/text.md) — typically "Skip" or "Done". Reads as inline 16/Semibold `primary` type at rest.

```preview
navigation-bar/page/link-trailing
---
import { NavigationBar } from '@blind-dsai/ui';

<NavigationBar
  variant="page"
  title="Pick your interests"
  leading={{ icon: <ChevronLeftIcon />, 'aria-label': 'Back' }}
  trailing={{ label: 'Skip', href: '#skip' }}
/>
```

### External page (close-only)

External content visited in-app (embedded webview, in-app browser). Leading drops — no flow to step back; trailing is a single close (×) [Icon Button](../button/icon.md) with `aria-label="Close"`.

```preview
navigation-bar/page/external-page
---
import { NavigationBar } from '@blind-dsai/ui';

<NavigationBar
  variant="page"
  title="Help center"
  trailing={{ icon: <XIcon />, 'aria-label': 'Close' }}
/>
```

### Title only

Both side slots empty — for non-dismissible sub-pages (forced confirmation, terms gate).

```preview
navigation-bar/page/title-only
---
import { NavigationBar } from '@blind-dsai/ui';

<NavigationBar
  variant="page"
  title="Terms of service"
/>
```

### Overlay (on hero / cover image)

`appearance="overlay"` paints a transparent container with **fixed-white** icons and title — the bar floats over a hero / cover image (canonical host: [Profile header](../profile-header/profile-header.md)). The image beneath provides the contrast; theme tokens don't apply because the bar is no longer the surface tier. The bar still pays its own `env(safe-area-inset-top)` so the status-bar zone reads cleanly against the image.

```preview
navigation-bar/page/overlay
---
import { NavigationBar } from '@blind-dsai/ui';

<NavigationBar
  variant="page"
  appearance="overlay"
  title=""
  leading={{ icon: <ChevronLeftIcon />, 'aria-label': 'Back' }}
  trailing={{ icon: <SearchIcon />, 'aria-label': 'Search' }}
/>
```

## Slots

- **leading** (optional) — typically a 24px back-arrow icon, rendered as a transparent icon capsule.
- **title** — page's name. Required, single line, `typo.heading.sm` (16/Semibold) `onSurface`, centred. Ellipsis on narrow.
- **trailing** (optional) — exactly one affordance. Three accepted shapes:
  1. A single 24px icon (transparent capsule). **Prefer the object form `trailing={{ icon, 'aria-label' }}` — the component then renders the 24px Icon Button internally and the `sys.icon.lg` contract is guaranteed.** If a raw `<Button variant="icon" />` node is passed instead, it MUST carry `size="large"` (= `sys.icon.lg` / 24); `size="medium"` resolves to `sys.icon.md` (16) and breaks symmetry with the leading slot.
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

Three-column grid (leading / title / trailing) sized **`1fr auto 1fr`** — equal side regions, so the centre `auto` column sits at the bar's geometric horizontal centre regardless of side-slot widths. The trailing column collapses to zero when empty. Action stays intact; title truncation is the safety net.

## States

The bar has no interactive state. Side slots inherit the recipe of whichever control they host — [Icon Button](../button/icon.md), [Toolbar Button](../button/toolbar.md), or [Text Button](../button/text.md). Title carries no states.

## Focus indicator

Bar isn't a focus target; side slots inherit each control's own focus composition. Trigger: `:focus-visible`.

## Behavior

- **Title centring.** `1fr auto 1fr` pins the title to the geometric centre — neither side slot can push it off-axis.
- **Title truncation.** Long names truncate with ellipsis; bar never grows past 56px. Safety net only.
- **Back affordance.** Leading slot is conventionally back-arrow; host wires `onClick` to the framework's back action.
