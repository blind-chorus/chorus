# List

A vertically-stacked sequence of rows for menus, settings panels, picker sheets, inline option groups, and expandable hierarchies. Five sub-components share one anatomy and diverge on the leading slot, the selection contract, and the expand contract.

**Reach for this when** the rows are same-kind chrome — settings entries, menu options, single-select picker rows, drill-in navigation, directory rows, expandable section headers. **Skip when** the rows are authored content with author + body + footer (use [Feed](../feed/feed.md)) or a horizontal collection of curated cards (use [Section](../section/section.md)). Pick the sub by the trailing affordance and the leading slot: no leading, no trailing → [Text](./text.md); single-select radio → [Radio](./radio.md); 40px avatar leading → [Thumbnail](./thumbnail.md); drill-in chevron → [Nav](./nav.md); expand chevron that rotates on click → [Accordion](./accordion.md).

**Layout inset.** `full-bleed` — sits as a direct child of the page shell. Each row pays its own `8px block / 16px inline` padding via `layout.container.xs` / `layout.container.md`; do **not** wrap the List in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the row leading edge (radio glyph, thumbnail, label start) lands at a different inset than surrounding chrome. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Cross-sub contract

- **Container.** Vertical stack, transparent fill (inherits the parent surface). Rows separated by a 1px `outlineVariant` divider inset 16px (`layout.container.md`) from the leading edge so the rule reads as separating *content*, not the container. No outer radius — corner shape belongs to the wrapping container.
- **Row geometry.** 8px block / 16px inline padding (`layout.container.xs` / `layout.container.md`); min-height 48px; leading-to-label gap `layout.inline.md` (8px). Row grows when `supportingText` is present.
- **Label column.** Label: 16px / Regular / `onSurface`. SupportingText: 14px / Regular / `onSurfaceVariant`, sits directly under the label with no extra gap — the two lines stack on the label-column's intrinsic line-box rhythm. Both truncate with ellipsis.
- **States.** `selected` exists only on Radio. The whole row is the interactive surface.
- **Focus indicator.** Composition: Inward (see [Focus ring composition](../../DESIGN.md#focus-ring-composition)) — inset shadows entirely inside the row's box. Trigger: `:focus-visible`.
- **Accessibility.** Text / Thumbnail / Nav expose `role="list"`; Radio exposes `role="radiogroup"` with each row `role="radio"` + `aria-checked`. Keyboard navigation (Arrow ↑/↓, Home/End) is handled by the container; Radio also commits on Space / Enter.

## Sub-components

- **[Text list](./text.md)** — Display / navigation rows. No leading slot; whole row is the click target. The default sub for menu lists that route or fire without a selection model.
- **[Radio list](./radio.md)** — Single-select picker with a leading 16px radio indicator; clicking a row commits its value via `onChange(value)`.
- **[Thumbnail list](./thumbnail.md)** — Avatar-anchored rows with a 40px leading [Thumbnail](../thumbnail/thumbnail.md). Same click semantics as Text.
- **[Nav list](./nav.md)** — Drill-in rows. Trailing edge auto-renders a right-pointing chevron.
- **[Accordion list](./accordion.md)** — Expandable rows. Trailing edge auto-renders a `ChevronDownIcon` that rotates `0° → 180°` on expand; the open trigger hosts a content body (prose or another `<List embedded>`) indented one extra `layout.container.md` so the body reads as nested inside the trigger's label column. When the body holds a `<List embedded>`, a hairline `outlineVariant` divider paints at the top of the body so parent ↔ child hierarchy reads.
