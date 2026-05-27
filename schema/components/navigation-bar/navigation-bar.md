# Navigation bar

The top app bar — a horizontal strip pinned to the top of a screen that names the screen and exposes its highest-priority actions. Three sub-flavors share this contract: **Home** (landing-screen bar), **Page** (drill-in bar with centred title), and **Search** (search-page bar with a bare-text input). All three sit at 16px inline / 8px block padding and delegate icon slots to [Icon Button](../button/icon.md).

**Layout inset.** `full-bleed` — sits flush at the top of the page shell. The bar owns its own `16px inline / 8px block` padding via `layout.container.*`; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div. The bar is pinned chrome, not a `<main>` child — sits *outside* the `<main>` that pays `sys.layout.page.*`. See [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

**Viewport safe area.** The bar's block padding stacks `env(safe-area-inset-top)` on top of the canonical `container.xs` (8) breathing room — so its `surface` background extends through the device status-bar / notch zone above the 56-tall content row, and scrolled body content does not bleed through the transparent system chrome. On non-mobile viewports `env()` resolves to 0 and the bar collapses to its original 8 / 16 padding. **The page shell MUST NOT add its own `padding-top: env(safe-area-inset-top)` when a NavigationBar is rendered at the top** — the bar already pays it, and stacking would double-inset the row by the notch height.

## Cross-sub contract

- **Container.** Horizontal strip with **16px inline + 8px block padding** (`sys.layout.container.md` × `sys.layout.container.xs`), `surface` fill, **min-height 56**. Inter-slot gap is `sys.layout.inline.xl` (16).
- **Slots.** A **leading** slot (icon), a **centre slot** (title text on Home/Page; bare input on Search), and a **trailing** slot (one or more icons on Home; a single button / link / icon on Page; conditional clear (×) on Search). Titles truncate with ellipsis; Search input never reflows its leading edge.
- **Icon slots are [Icon Buttons](../button/icon.md).** Every icon slot renders as a 40 × 40 transparent capsule hosting a 24px (`sys.icon.lg`) glyph.
- **Title is not interactive.**
- **Accessibility.** Bar exposes `role="banner"` (Home, as main banner) or no implicit role (Page — page chrome). Icon slots carry `aria-label`; the page's `<h1>` lives in the page body.

## Sub-components

- **[Home](./home.md)** — Landing-screen top bar. Left-aligned page name (`typo.heading.lg`, 24/Semibold) preceded by a leading menu icon; up to three trailing action icons. Min-height 56.
- **[Page](./page.md)** — Drill-in top bar. Centred page name (`typo.heading.sm`, 16/Semibold); leading back-arrow and a trailing slot ([Toolbar Button](../button/toolbar.md), text link, or single icon). Min-height 56.
- **[Search](./search.md)** — Search-page top bar. Leading back-arrow Icon Button, a single bare-text input filling the middle column, and a conditional clear (×) Icon Button. No title slot. Min-height 56.
