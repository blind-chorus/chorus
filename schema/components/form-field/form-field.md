# Form Field

The text-entry primitives — a family of controls the user types into. **Input** is the single-line field; **Search Bar** is its search-shaped sibling. The cross-family contract is the shared field anatomy: a bordered, surface-toned container, an at-rest hairline stroke that thickens while active, and an `error` appearance that re-tones the whole field.

## Sub-components

- **[Input](./input.md)** — Single-line text input. Surface-toned box, hairline `outlineVariant` stroke at rest, high-contrast `onSurface` border while active, optional trailing clear ("×") button. Corner radius `sys.radius.md`. `error` appearance re-tones to the error family.
- **[Search Bar](./search.md)** — Single-line search field. Same anatomy and state model as Input with three deltas: a leading `SearchIcon` glyph, corner radius stepped to `sys.radius.full` (pill), and a bare-box-only contract — no `label`, `helper`, or `maxLength`.
