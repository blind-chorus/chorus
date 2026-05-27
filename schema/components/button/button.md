# Button

The action-surface family. **Standard Button** is the default inline filled / outlined / tertiary control; the rest specialise by **shape · context · footprint**: floating canvas commit (FAB), glyph-only capsule (Icon Button), chromeless link-shaped commit (Text Button), dense capsule for toolbars and tabs (Toolbar Button), reversible commit at the Toolbar footprint (Toggle Button), option-toggle with leading checkbox (Check Button). Per-sub intent lives on each sub's page.

**Layout inset.** `inline` — slot atom. No page-rail responsibility; the surrounding container places it. Lives inside another component's slot (List row trailing, Section header trailing, NavigationBar trailing, BottomSheet action stack) or inside a layout `<div>` that already pays the page gutter. The FAB sub is the one exception — pinned to the page viewport, not the row rail.

## Cross-sub contract

Three contracts hold across every family member — change one and every sub re-tones.

### Icon colour inheritance

**Every Button family component paints icon glyphs in the label / foreground colour via `currentColor`.** The SVG must declare `fill="currentColor"` (or `stroke="currentColor"`) with no hardcoded colour. Icon size follows the host's typography rung (24 on `large`, 16 on `medium`/`small`).

### Optical alignment

Transparent-rest forms ([Icon Button](./icon.md), [Text Button](./text.md), [Tertiary appearance of Standard Button](./standard.md#tertiary)) apply negative-margin compensation so the **glyph / label bounding box** is the layout box. Filled forms ([Standard Button](./standard.md), [FAB](./fab.md), [Toolbar Button](./toolbar.md)) align by **chrome**: the visible container is the layout box.

### Focus ring

All Button family components draw the same outward two-layer ring as a `position: absolute` pseudo-element — never a layout-affecting border. Suppressed while `disabled`. Trigger: `:focus-visible`. See [DESIGN.md → Focus ring composition](../../DESIGN.md#focus-ring-composition).

## Sub-components

- **[Check](./check.md)** — Option-toggle commit with a required leading checkbox glyph (outline → fill on `checked`) and an optional middle icon. Two sizes; reads as a [Text](./text.md) Button with a checkbox.
- **[FAB](./fab.md)** — Surface-elevated pill anchored to the canvas; commit stays reachable while content scrolls.
- **[Icon](./icon.md)** — 40 × 40 transparent capsule, glyph-only. Requires `aria-label`.
- **[Standard](./standard.md)** — The default inline action. Four appearance treatments (`primary` / `secondary` / `outlined` / `tertiary`) over three sizes.
- **[Text](./text.md)** — Link-shaped commit at the 16/Semibold rung; reads as inline `primary` type at rest.
- **[Toggle](./toggle.md)** — Reversible commit at the Toolbar footprint. Follow ↔ Following.
- **[Toolbar](./toolbar.md)** — 32px capsule for dense inline actions. Chrome shared with [Filter chip](../chip/filter.md).
