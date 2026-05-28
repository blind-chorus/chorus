---
"@blind-dsai/ui": minor
---

Add two composite list components and unify the optional-header contract across SuggestionList / Carousel.

**New components:**

- **`DirectoryList`** — vertical follow-roster (`<Header />` + `<List variant="entry" size="large" />`). Sibling of SuggestionList: same entity-agnostic row anatomy (avatar + identity + trailing Toggle Button) but no swipeable pager — the full set is scanned vertically at the `large` (48 avatar) rung. Reach for it on browse / "new channels" / "people you may know" surfaces.
- **`NavList`** — vertical label-only nav block (`<Header />` + `<List variant="nav" />`). Each row is a route target; trailing chevron supplied by the nav variant. Reach for it on category indexes, settings menus, and any "pick a sub-page" surface where no leading thumbnail belongs.

Both wrappers share the SuggestionList surface chrome (`surface` fill, `container.lg` block / `container.md` inline padding, `stack.md` (16) header-to-list gap) and force the inner List into embedded mode so the wrapper owns the rail. Rows keep the list-family-default `container.md` inline padding for the touch target and add `margin-inline: -container.md` so the visible avatar / label lines up with the header label at 16 from the surface — same alignment trick SuggestionList uses for its page rows.

**Header contract unified across composite blocks:**

- `SuggestionList`, `Carousel` (`PostCarousel`, `ProfileCarousel`): `label` is required; the optional `headerAction` extends the header with a trailing `accent` Text Button when there's an index page to route to. The previously-documented `no header` and `no header action` variants are removed — every composite block now carries a label.
- `Text Button` docs: `Accent` is promoted out of "Use cases" to a top-level type/appearance section directly under `Default`, matching the other appearance variants.
