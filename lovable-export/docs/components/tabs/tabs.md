# Tabs

A horizontal row of mutually-exclusive selections — exactly one tab is active at a time, and selecting one swaps the surrounding panel of content. Two sub-flavors share this contract: **Underline** is the canonical content-section switcher; **Segmented** is the inline view-mode toggle whose chrome delegates to [Filter chip](../chip/filter.md).

## Cross-sub contract

- **Selection model.** Single-select — exactly one Tab is active. The `Tabs` container owns the controlled `value`; selecting fires `onChange(value)`. For multi-select, reach for [Filter chips](../chip/filter.md) instead.
- **Slots.** Each Tab carries a required **label** and an optional **leadingIcon** sized to the active sub's icon rung. No trailing slot.
- **Selected as a state, not a variant.** A Tab's selected appearance is a state — the same element flips into and out of it as the parent's `value` changes.
- **Accessibility.** Container exposes `role="tablist"` with caller-supplied `aria-label`; each Tab exposes `role="tab"` + `aria-selected`. Keyboard nav (←/→, Home/End) is handled by the container.

## Sub-components

- **[Underline](./underline.md)** — Horizontal tab row with a single 2px (`sys.borderWidth.thin`) `onSurface` indicator that slides between the active tab's bottom edge. Default shape for switching content panels.
- **[Rounded](./rounded.md)** — Rounded-rectangle tab row, each tab a self-contained chip with a required leading icon and label. Shares Segmented's geometry verbatim but steps the corner radius from `full` to `sys.radius.md` (8).
- **[Segmented](./segmented.md)** — Row of inline mode toggles whose chrome is delegated to [Filter chip](../chip/filter.md). Reach for this for in-place view-mode changes (List ↔ Grid, Day ↔ Week ↔ Month).
