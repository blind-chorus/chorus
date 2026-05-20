# @blind-dsai/visual-regression

Playwright-based visual regression for the Chorus docs site. Catches unintended visual drift from token retunes, CSS edits, or component renames.

## Scope (deliberately small)

| Surface | Why |
| --- | --- |
| `/` | Landing chrome — NavigationBar, side nav, body shell |
| `/components/list` | Row layouts, variants, dividers |
| `/components/feed` | Highest-density composition (avatars, thumbnails, poll banner, citation card) |
| `/iconography/all` | Icon grid + the new FormField search |

Two themes × four pages = **8 baseline screenshots**. The point is to catch surprise drift, not pixel-perfect coverage of every component. Add a surface only when the diff cost of *not* watching it is higher than the noise cost of one more baseline.

## Running

First time:

```bash
npm install                                                  # install root workspaces
npm --workspace @blind-dsai/visual-regression run install:browsers   # one-time Chromium download
```

Each run:

```bash
npm --workspace @blind-dsai/visual-regression test            # compares vs baseline
npm --workspace @blind-dsai/visual-regression run update      # overwrites baseline (audit diffs first!)
```

The config builds the docs site with `next build` + `next start -p 3100`. Local dev servers on port 3000 are not interfered with.

## Updating baselines

1. Make the intentional visual change.
2. Run `npm run test`.
3. Open `test-results/*/diff.png` (or the HTML report) and visually verify every diff is intended.
4. Run `npm run update` to overwrite baselines.
5. Commit the new `__snapshots__/**/*.png` files together with the source change.

**Never run `update` without auditing the diffs.** That defeats the whole purpose.

## CI integration

CI runs `npm test` against the same Chromium / viewport / device profile as local. Disagreement between local and CI is almost always due to OS-level font rendering — keep the test fleet on Linux (Playwright's default Chromium ships its own font stack) by running the CI job on `ubuntu-latest`.

The baseline screenshots themselves are **committed to git** (under `test/__snapshots__/`). This makes the source of truth visible at review time: the diff in the PR shows what changed.
