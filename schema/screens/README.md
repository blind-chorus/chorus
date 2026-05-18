# Screen Recipes

Pre-validated screen-level compositions. Each `*.screen.json` file binds a small number of regions (top / body / bottom / fab / overlay) to families + sub-components from `schema/components/`, with concrete demo data inline.

Agents (Lovable, v0, Cursor, Claude Design, the Figma plugin) **prefer cloning a recipe over from-scratch composition**. A recipe is a known-good starting point — its slot-fill, family pairing, and screen-level rules (one NavigationBar, at most one FAB, modal pairing, etc.) are already correct.

## The contract

`screen.schema.json` is authoritative. The shape, summarized:

```json
{
  "slug": "kebab-case",
  "name": "Title Case",
  "description": "One paragraph — what kind of screen, when to reach for it.",
  "useCases": ["natural-language intent strings"],
  "regions": {
    "top":     { "family": "navigation-bar", "subcomponent": "search", "props": { ... } },
    "body":    { "family": "list",           "items": [ ... ] },
    "fab":     { "family": "button",         "subcomponent": "fab", "props": { ... } },
    "overlay": { "family": "bottom-sheet",   "props": { ... }, "note": "Opens on row long-press." }
  },
  "rules": ["Recipe-specific guardrails an agent must respect when varying."],
  "swappable": {
    "body": ["feed", "channel-list"]
  }
}
```

### Region semantics

- **`top`** — the top bar. Always a `navigation-bar/*` (or omitted on fullscreen overlays).
- **`body`** — the main scrollable content. One of `list`, `feed`, `channel-list`, `channel-rail`, or a one-off composition.
- **`bottom`** — a persistent bottom region (segmented tabs, primary action row). Often empty.
- **`fab`** — at most one FAB per screen (see [AGENTS.md](../../AGENTS.md) hard rules).
- **`overlay`** — a `bottom-sheet` or `dialog` triggered from elsewhere on the screen. Pair its trigger in another region's `note`.

Additional region names are allowed (see `additionalProperties` in the schema) but try to fit into the canonical four before inventing a new one.

## Authoring a new recipe

1. Pick a slug. `<slug>.screen.json`.
2. Add an entry to [`../manifest.json`](../manifest.json) under `screens`.
3. Cross-check against [AGENTS.md](../../AGENTS.md) hard rules.
4. Demo strings must be English ([memory: preview english]).
5. Keep `items` arrays short — recipes are starting points, not fixtures.

[memory: preview english]: ../../claude-memory/feedback_preview_english.md
