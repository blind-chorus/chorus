# How to import this export into the Lovable repo

Target: a local clone of your Lovable-connected GitHub repo (e.g. `lov-test-v1-bobjobs`).

This folder is pre-organized into three drop-target buckets matched to the macOS Finder drag/drop workflow. Perform the three steps **in order**. For each step, select the **contents** of the bucket folder (not the folder itself) and drag them onto the indicated location in the target repo.

---

## Step 1 — `import/step1-merge-to-root/` → target repo **root**
Finder prompt: choose **"Merge"**

Preserves the target repo's `.git`, `node_modules`, lockfile, and any Lovable-authored files.

Contents:
- `public/`
- `src/` (hooks, lib, routes, routeTree.gen.ts, router.tsx, server.ts, start.ts, styles.css)

> If individual files conflict, Finder will additionally ask Keep/Replace — pick **"Replace All"**.

---

## Step 2 — `import/step2-replace-to-root/` → target repo **root**
Finder prompt: choose **"Replace"**

`docs/` is wiped and rebuilt on every `npm run build:lovable`, so a wholesale replace is the safe option (stale orphan files can never linger).

Contents:
- `docs/`
- Root config and guide files (`package.json`, `tsconfig.json`, `components.json`, `eslint.config.js`, `vite.config.ts`, `bunfig.toml`, `wrangler.jsonc`, `AGENTS.md`, `PROMPTING.md`, `README.md`, `.gitignore`, `.prettierignore`, `.prettierrc`)

> ⚠️ If Lovable manually added deps to its `package.json`, diff first and merge by hand before accepting the replace.

---

## Step 3 — `import/step3-replace-to-src/components/` → target repo's **`src/` folder**
Finder prompt: choose **"Replace"**

Replaces `src/components/chorus/` wholesale, so renamed or removed components do not leave stale files behind.

> Lovable-hand-authored components elsewhere under `src/components/` (anywhere outside `chorus/`) survive — the replace only fires on the conflicting `chorus/` subfolder.

---

## Why three buckets and not one?

The buckets land at three different depths in the target repo (root, root, `src/`). macOS Finder can't choose merge-vs-replace per-folder inside a single drag, so combining them would either:

- wipe Lovable-authored `routes/`, `hooks/`, `lib/` (if "Replace" picked at root), or
- leave stale `chorus/` components after rename/remove (if "Merge" picked everywhere).

Splitting by drop target makes each step a one-folder drag with one unambiguous option.

## Notes

- `lovable-export/` is an **import-only tree** — every generated output lives under exactly one `import/step*` bucket. There is no flat mirror, and nothing is duplicated.
- `npm run build:lovable` is idempotent: re-running it produces a byte-identical tree if no source changed.
