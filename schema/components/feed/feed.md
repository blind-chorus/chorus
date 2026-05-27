# Feed

The unit of a scrolling stream. The family covers two card shapes that ride the same column: **[Post](./post.md)** — the authored content card (channel header, title + body, optional thumbnail / poll / offer / citation / mention, engagement footer); **[Ad](./ad.md)** — the sponsored placement (brand row, optional title + body, a hero + CTA slab, no engagement row).

Editorial collections of popular posts ride alongside Feed cards via the [Section · Post Carousel](../section/post-carousel.md) sub of the [Section](../section/section.md) family — that pair owns the curated-collection placement, not Feed itself.

**Reach for this when** the column is an open-ended stream of authored items (posts, comments, discussion threads, timeline entries) or a sponsored placement that needs to tile cleanly into that stream. **Skip when** the rows are same-kind chrome with no author voice (use [List](../list/list.md)), the collection is a finite curated set rendered horizontally (use [Section · Post Carousel](../section/post-carousel.md)), or the entries are channel / profile cards (use [Section · Profile Carousel](../section/profile-carousel.md) or [SuggestionList](../suggestion-list/suggestion-list.md)). Pick the sub by the commit surface: authored content with engagement row → [Post](./post.md); sponsored placement with hero + CTA slab → [Ad](./ad.md).

**Layout inset.** `full-bleed` — sits as a direct child of the page shell. Both subs pay their own `sys.layout.container.md` (16px) inline padding via the card chrome; do **not** wrap the Feed in another `padding-inline` / `px-*` / `style={{ padding: … }}` div, or the feed-item author block lands at a different inset than the section headings and list rows around it. Inside a bounded surface (Card / Dialog / BottomSheet / Sheet), apply the negative-margin opt-out — see [`AGENTS.md` § Composition rules](../../../AGENTS.md#composition-rules).

## Cross-sub contract

Both subs share a column so authored posts and sponsored placements tile cleanly in the same stream.

### Column geometry

Same container surface (`sys.color.surface`), `sys.layout.container.md` (16px) inline padding, `sys.layout.stack.md` between blocks, column-width contract (`width: 100%`; on web both inherit the `comp-content-max` cap).

### Brand row vs author row

Both subs lead with a 32-rung [Thumbnail](../thumbnail/thumbnail.md) + stacked text column. Post binds channel + timestamp + follow affordance; Ad binds brand name + `Sponsored` subtitle + opt-in dismiss. Same anatomy rung, different commit surface.

### No engagement row on sponsored content

Ad omits the engagement footer — ads are not authored content; the only commit is the CTA. Post keeps the Likes / Comments / Views row.

## Sub-components

- **[Post](./post.md)** — the authored content card. Default of the family.
- **[Ad](./ad.md)** — the in-feed sponsored placement.
