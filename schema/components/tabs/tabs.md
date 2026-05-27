# Tabs

A horizontal row of mutually-exclusive selections — exactly one tab is active, and selecting one swaps the surrounding panel. Sub-flavors: **Underline** is the canonical content-section switcher; **Segmented** is the inline view-mode toggle whose chrome delegates to [Filter chip](../chip/filter.md).

**Layout inset.** `full-bleed` — sits as a direct child of the page shell (or any surface that pays the gutter) and stretches edge-to-edge inside it. The tabs rail pays its own internal padding via `layout.container.*`; do **not** wrap it in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the page rail double-pays. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Cross-sub contract

- **Selection model.** Single-select. `Tabs` owns the controlled `value`; selecting fires `onChange(value)`. For multi-select, use [Filter chips](../chip/filter.md).
- **Slots.** Each Tab has a required **label** and an optional **leadingIcon** sized to the active sub's icon rung. No trailing slot.
- **Selected as a state, not a variant.** Same element flips in/out as the parent's `value` changes.
- **Accessibility.** Container exposes `role="tablist"` with caller-supplied `aria-label`; each Tab has `role="tab"` + `aria-selected`. Keyboard nav (←/→, Home/End) handled by container.

## Sub-components

- **[Underline](./underline.md)** — Tab row with a single 2px (`sys.borderWidth.thin`) `onSurface` indicator that slides along the active tab's bottom edge. Default for switching content panels.
- **[Rounded](./rounded.md)** — Rounded-rectangle tab row, each tab a self-contained chip with a required leading icon and label. Shares Segmented's geometry, but corner radius steps from `full` to `sys.radius.md` (8).
- **[Segmented](./segmented.md)** — Row of inline mode toggles whose chrome delegates to [Filter chip](../chip/filter.md). For in-place view-mode changes (List ↔ Grid, Day ↔ Week ↔ Month).
