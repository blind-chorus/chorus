# Form field

The text-entry primitives — controls the user types into or picks a value from. **Input** is single-line text; **Search Bar** is its search-shaped sibling; **Select** is the Input-shaped picker that opens a sheet. Cross-family contract: bordered surface-toned container, hairline rest stroke that thickens while active, `error` appearance re-tones the whole field.

**Layout inset.** `inline` — slot atom. No page-rail responsibility; the surrounding container places it. Sits inside a labelled form layout (vertical FormField stack) or another component's slot (NavigationBar centre for Search, BottomSheet body for quick-entry) — never a sibling of `full-bleed` page rows. The form column pays the page gutter, not the field.

## Sub-components

- **[Input](./input.md)** — Single-line text input. Surface-toned box, hairline `outlineVariant` rest stroke, `onSurface` border while active, optional trailing clear ("×"). Corner radius `sys.radius.md`. `error` appearance re-tones to error family. Compose multiple via the **Group** use case.
- **[Search bar](./search.md)** — Same anatomy and state model as Input with three deltas: leading `SearchIcon` glyph, corner radius stepped to `sys.radius.full` (pill), bare-box-only (no `label`, `helper`, or `maxLength`).
- **[Select](./select.md)** — Input-shaped picker. Read-only field with a trailing `ArrowDownIcon` (16px) chevron; clicking opens a `BottomSheet` with the option list. Supports the same optional leading icon as Input, plus a horizontal **Group** use case (country code + number, currency + amount).
