# Screen recipes

Pre-validated screen-level compositions. Each `*.screen.json` binds regions (`top`/`body`/`bottom`/`fab`/`overlay`) to families + sub-components from `schema/components/`, with concrete demo data inline.

Agents **prefer cloning a recipe over from-scratch composition**. Slot-fill, family pairing, and screen-level rules (one NavigationBar, ≤1 FAB, modal pairing) are already correct.

## Contract

`screen.schema.json` is authoritative. Shape:

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
    "body": ["feed", "suggestion-list"]
  }
}
```

### Region semantics

- **`top`** — top bar. Always `navigation-bar/*` (or omitted on fullscreen overlays).
- **`body`** — main scrollable content. One of `list`, `feed`, `suggestion-list`, `avatar-rail`, or a one-off composition.
- **`bottom`** — persistent bottom region (segmented tabs, primary action row). Often empty.
- **`fab`** — ≤1 FAB per screen (see [AGENTS.md](../../AGENTS.md) hard rules).
- **`overlay`** — `bottom-sheet` or `dialog` triggered from elsewhere. Pair its trigger in another region's `note`.

Additional region names allowed (`additionalProperties` in schema) but prefer the canonical four.

## Authoring a new recipe

1. Pick a slug. `<slug>.screen.json`.
2. Add entry to [`../manifest.json`](../manifest.json) under `screens`.
3. Cross-check [AGENTS.md](../../AGENTS.md) hard rules.
4. Demo strings English ([memory: preview english]).
5. Keep `items` arrays short — recipes are starting points, not fixtures.

[memory: preview english]: ../../claude-memory/feedback_preview_english.md
