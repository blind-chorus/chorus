# List

A vertically-stacked sequence of rows for menus, settings panels, picker sheets, and inline option groups. Four sub-components share one anatomy and diverge on the leading slot and selection contract.

## Cross-sub contract

- **Container.** Vertical stack, transparent fill (inherits the parent surface). Rows separated by a 1px `outlineVariant` divider. No outer radius — corner shape belongs to the wrapping container.
- **Row geometry.** 12px block / 16px inline padding; min-height 48px; leading-to-label gap `layout.inline.md` (8px). Row grows when `supportingText` is present.
- **Label column.** Label: 16px / Regular / `onSurface`. SupportingText: 14px / Regular / `onSurfaceVariant`, 2px below label. Both truncate with ellipsis.
- **States.** `selected` exists only on Radio. The whole row is the interactive surface.
- **Focus indicator.** Composition: Inward (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)) — inset shadows entirely inside the row's box. Trigger: `:focus-visible`.
- **Accessibility.** Text / Thumbnail / Nav expose `role="list"`; Radio exposes `role="radiogroup"` with each row `role="radio"` + `aria-checked`. Keyboard navigation (Arrow ↑/↓, Home/End) is handled by the container; Radio also commits on Space / Enter.

## Sub-components

- **[Text list](./text.md)** — Display / navigation rows. No leading slot; whole row is the click target. The default sub for menu lists that route or fire without a selection model.
- **[Radio list](./radio.md)** — Single-select picker with a leading 16px radio indicator; clicking a row commits its value via `onChange(value)`.
- **[Thumbnail list](./thumbnail.md)** — Avatar-anchored rows with a 40px leading [Thumbnail](../thumbnail/thumbnail.md). Same click semantics as Text.
- **[Nav list](./nav.md)** — Drill-in rows. Trailing edge auto-renders a right-pointing chevron.
