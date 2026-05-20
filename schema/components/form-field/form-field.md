# Form Field

The text-entry primitives — a family of controls the user types into or picks a value from. **Input** is the single-line text field; **Search Bar** is its search-shaped sibling; **Select** is the Input-shaped picker that opens a sheet. The cross-family contract is the shared field anatomy: a bordered, surface-toned container, an at-rest hairline stroke that thickens while active, and an `error` appearance that re-tones the whole field.

## Sub-components

- **[Input](./input.md)** — Single-line text input. Surface-toned box, hairline `outlineVariant` stroke at rest, high-contrast `onSurface` border while active, optional trailing clear ("×") button. Corner radius `sys.radius.md`. `error` appearance re-tones to the error family. Compose multiple Inputs into a vertical stack via the **Group** use case.
- **[Search Bar](./search.md)** — Single-line search field. Same anatomy and state model as Input with three deltas: a leading `SearchIcon` glyph, corner radius stepped to `sys.radius.full` (pill), and a bare-box-only contract — no `label`, `helper`, or `maxLength`.
- **[Select](./select.md)** — Input-shaped picker. Read-only field with a trailing `DownwardIcon` (16px) chevron; clicking opens a `BottomSheet` with the option list. Supports the same optional leading icon as Input, and a horizontal **Group** use case for paired Select+Input rows (country code + number, currency + amount).
