# Patterns

Canonical visual references for Chorus. Each pattern pairs an image (`<slug>.png`) with a spec note (`<slug>.md`) that explains intent, layout, tokens, and components in use.

Purpose: when an agent composes a new screen or picks a token, it should be able to look at a real, signed-off pixel target and the rationale behind it — not just the schema. Schemas say *what is allowed*; patterns say *what good looks like*.

## Precedence (read this first)

Patterns are **descriptive**, not prescriptive. The list below is **authority on conflict**, distinct from the [`AGENTS.md`](../AGENTS.md) "Read order" (which is the *intake sequence* for picking up the system). Read order says where to look first; precedence says who wins when two sources disagree.

1. **Hard rules** in [`AGENTS.md`](../AGENTS.md) — always win.
2. **Component specs** in [`components/<family>/<sub>.spec.json`](../components) and [`DESIGN.md`](../DESIGN.md) — authoritative for props, slots, sizes, appearances, states, and cross-cutting design rules.
3. **Resolved tokens** in [`tokens/`](../tokens) — authoritative for color/type/space/radius values.
4. **Screen recipes** in [`screens/`](../screens) — authoritative for validated compositions.
5. **Patterns (this directory)** — visual reference and rationale only. If a pattern note conflicts with a spec or token, the spec/token wins; treat the pattern as out of date and fix it.

## How agents should use this

1. Before composing a new screen, scan this directory for the closest intent match (use `status: canonical` first).
2. Read the `.md` to understand which tokens, components, and layout decisions are load-bearing.
3. Pull the image into context if pixel-level alignment matters (spacing rhythm, hierarchy, dark/light parity).
4. Cross-check against the relevant `*.spec.json` and `resolved.*.json` — those are the contract; this is the inspiration.
5. Prefer cloning a recipe in [`screens/`](../screens) when one matches the pattern.

## File layout

```
patterns/
  README.md              # this file — index
  <slug>.png             # 1x or 2x, sRGB; dark variant: <slug>.dark.png
  <slug>.md              # spec note
```

Slugs match `screens/<slug>.screen.json` when a paired recipe exists.

## Index

<!-- Keep alphabetical. Add a row when you add a pattern. -->

| Slug | Status | Recipe | Notes |
|------|--------|--------|-------|
| [main_home](main_home.md) | canonical | [main-home](../screens/main-home.screen.json) | Default landing feed; channel rail + callouts + post stream + tab bar. |
| [main_explore](main_explore.md) | canonical | [main-explore](../screens/main-explore.screen.json) | Discovery: recommended channels and hot post rails under underline tabs. |
| [main_jobs](main_jobs.md) | canonical | [main-jobs](../screens/main-jobs.screen.json) | Search-led job list with filter chips and a "Job saved" toast. |
| [main_notifications](main_notifications.md) | canonical | [main-notifications](../screens/main-notifications.screen.json) | Keyword/news tabs, filter chips, bell-leading notification list. |
| [main_company](main_company.md) | canonical | [main-company](../screens/main-company.screen.json) | Company-scoped feed with company chip row, Overview callout, HOT/BEST eyebrows. |
| [post](post.md) | canonical | [post](../screens/post.screen.json) | Single-post detail with toolbar, body, embedded poll, footer notice. |
| [post_comments](post_comments.md) | canonical | [post-comments](../screens/post-comments.screen.json) | Threaded comments with sort/jump controls and persistent compose bar. |
| [compose](compose.md) | canonical | [compose](../screens/compose.screen.json) | Post composition modal with Cancel/Post bar, pickers, title input, coaching callout. |
| [compose_channel](compose_channel.md) | canonical | [compose-channel](../screens/compose-channel.screen.json) | Bottom-sheet channel picker paired with [compose](compose.md). |
| [compose_kr](compose_kr.md) | canonical | [compose-kr](../screens/compose-kr.screen.json) | Korean-locale compose with megaphone promotion CTA + coachmark + 'attempts remaining' quota. |
| [compose_kr_promotion](compose_kr_promotion.md) | canonical | [compose-kr-promotion](../screens/compose-kr-promotion.screen.json) | Bottom-sheet purchase flow for the promotion-link feature, triggered from [compose_kr](compose_kr.md). |
| [compose_offereval](compose_offereval.md) | canonical | [compose-offereval](../screens/compose-offereval.screen.json) | Expanded compose state: body editor focused, offer/poll floating pill, popular tags, insert toolbar. |

> Pattern slugs use `snake_case` (legacy from image filenames); recipe slugs use `kebab-case` (required by `screen.schema.json`'s slug pattern). The two are paired explicitly in this table.

## Status values

- **canonical** — signed-off reference. Agents should bias toward matching this.
- **draft** — proposed direction; do not assume tokens/components are final.
- **deprecated** — kept for diffing against newer canonical versions. Do not copy.

## Adding a pattern

1. Drop `<slug>.png` (and optional `<slug>.dark.png`) here. Prefer device-frame-free crops at component-pixel density.
2. Create `<slug>.md` with frontmatter (`name`, `image`, `status`, optional `recipe`) and the sections used by existing patterns: **Intent**, **Layout**, **Tokens in use**, **Components**, **Notes**.
3. Add a row to the index above.
4. If the pattern corresponds to a `screens/*.screen.json`, link both ways.
