# Keyscreens

Canonical visual references for Chorus. Each keyscreen pairs an image (`<slug>.png`) with a spec note (`<slug>.md`) that explains intent, layout, tokens, and components in use.

Purpose: when an agent composes a new screen or picks a token, it should be able to look at a real, signed-off pixel target and the rationale behind it — not just the schema. Schemas say *what is allowed*; keyscreens say *what good looks like*.

## Precedence (read this first)

Keyscreens are **descriptive**, not prescriptive. The list below is **authority on conflict**, distinct from the [`AGENTS.md`](../../AGENTS.md) "Read order" (which is the *intake sequence* for picking up the system). Read order says where to look first; precedence says who wins when two sources disagree.

1. **Hard rules** in [`AGENTS.md`](../../AGENTS.md) — always win.
2. **Component specs** in [`schema/components/<family>/<sub>.spec.json`](../../schema/components) and [`schema/DESIGN.md`](../../schema/DESIGN.md) — authoritative for props, slots, sizes, appearances, states, and cross-cutting design rules.
3. **Resolved tokens** in [`schema/tokens/`](../../schema/tokens) — authoritative for color/type/space/radius values.
4. **Screen recipes** in [`schema/screens/`](../../schema/screens) — authoritative for validated compositions.
5. **Keyscreens (this directory)** — visual reference and rationale only. If a keyscreen note conflicts with a spec or token, the spec/token wins; treat the keyscreen as out of date and fix it.

## How agents should use this

1. Before composing a new screen, scan this directory for the closest intent match (use `status: canonical` first).
2. Read the `.md` to understand which tokens, components, and layout decisions are load-bearing.
3. Pull the image into context if pixel-level alignment matters (spacing rhythm, hierarchy, dark/light parity).
4. Cross-check against the relevant `*.spec.json` and `resolved.*.json` — those are the contract; this is the inspiration.
5. Prefer cloning a recipe in [`schema/screens/`](../../schema/screens) when one matches the keyscreen.

## File layout

```
docs/keyscreens/
  README.md              # this file — index
  <slug>.png             # 1x or 2x, sRGB; dark variant: <slug>.dark.png
  <slug>.md              # spec note
```

Slugs match `schema/screens/<slug>.screen.json` when a paired recipe exists.

## Index

<!-- Keep alphabetical. Add a row when you add a keyscreen. -->

| Slug | Status | Recipe | Notes |
|------|--------|--------|-------|
| [main_home](main_home.md) | canonical | — | Default landing feed; channel rail + callouts + post stream + tab bar. |
| [main_explore](main_explore.md) | canonical | — | Discovery: recommended channels and hot post rails under underline tabs. |
| [main_jobs](main_jobs.md) | canonical | — | Search-led job list with filter chips and a "Job saved" toast. |
| [main_notifications](main_notifications.md) | canonical | — | Keyword/news tabs, filter chips, bell-leading notification list. |
| [main_company](main_company.md) | canonical | — | Company-scoped feed with company chip row, Overview callout, HOT/BEST eyebrows. |
| [post](post.md) | canonical | — | Single-post detail with toolbar, body, embedded poll, footer notice. |
| [post_comments](post_comments.md) | canonical | — | Threaded comments with sort/jump controls and persistent compose bar. |
| [compose](compose.md) | canonical | — | Post composition modal with Cancel/Post bar, pickers, title input, coaching callout. |
| [compose_selectChannel](compose_selectChannel.md) | canonical | — | Bottom-sheet channel picker paired with [compose](compose.md). |

## Status values

- **canonical** — signed-off reference. Agents should bias toward matching this.
- **draft** — proposed direction; do not assume tokens/components are final.
- **deprecated** — kept for diffing against newer canonical versions. Do not copy.

## Adding a keyscreen

1. Drop `<slug>.png` (and optional `<slug>.dark.png`) here. Prefer device-frame-free crops at component-pixel density.
2. Create `<slug>.md` with frontmatter (`name`, `image`, `status`, optional `recipe`) and the sections used by existing keyscreens: **Intent**, **Layout**, **Tokens in use**, **Components**, **Notes**.
3. Add a row to the index above.
4. If the keyscreen corresponds to a `schema/screens/*.screen.json`, link both ways.
