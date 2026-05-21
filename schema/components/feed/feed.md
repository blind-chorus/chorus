# Feed

The unit of a scrolling stream. The family covers two card shapes that ride the same column: **[Post](./post.md)** — the authored content card (channel header, title + body, optional thumbnail / poll / offer / citation / mention, engagement footer); **[Ad](./ad.md)** — the sponsored placement (brand row, optional title + body, a hero + CTA slab, no engagement row).

Editorial collections of popular posts ride alongside Feed cards via the [Section · Post Carousel](../section/post-carousel.md) sub of the [Section](../section/section.md) family — that pair owns the curated-collection placement, not Feed itself.

## Cross-sub contract

The two subs share a column — the contract below holds across the family so authored posts and sponsored placements tile cleanly in the same stream.

### Column geometry

Same container surface (`sys.color.surface`), same `sys.layout.container.md` (16px) inline padding, same `sys.layout.stack.md` between blocks, same column-width contract (`width: 100%`; on web both inherit the `comp-content-max` cap). A sponsored placement drops in without re-tuning the surrounding feed's rhythm.

### Brand row vs author row

Both subs lead with a 32-rung [Thumbnail](../thumbnail/thumbnail.md) + a stacked text column. Post binds channel + timestamp + follow affordance; Ad binds brand name + a `Sponsored` subtitle + an opt-in dismiss. Same anatomy rung, different commit surface.

### No engagement row on sponsored content

Ad deliberately omits the engagement footer. Ads are not authored content — the only commit on the placement is the CTA. Post keeps the Likes / Comments / Views row.

## Sub-components

- **[Post](./post.md)** — the authored content card. Default of the family.
- **[Ad](./ad.md)** — the in-feed sponsored placement.
