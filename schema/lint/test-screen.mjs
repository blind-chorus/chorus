#!/usr/bin/env node
// Smoke test: feed deliberately-broken recipes to validate-screen.mjs and
// assert the issues are caught. Run with `node schema/lint/test-screen.mjs`.

import { execSync } from "node:child_process";
import { writeFileSync, mkdtempSync, rmSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const SELF = fileURLToPath(import.meta.url);
const SCHEMA_DIR = resolve(dirname(SELF), "..");
const VALIDATOR = join(SCHEMA_DIR, "lint", "validate-screen.mjs");
const REAL_MANIFEST = JSON.parse(readFileSync(join(SCHEMA_DIR, "manifest.json"), "utf8"));

const cases = [
  {
    name: "two navigation bars",
    recipe: {
      slug: "bad-two-navs",
      name: "Bad",
      description: "two nav bars",
      regions: {
        top: { family: "navigation-bar", subcomponent: "home", props: { title: "A" } },
        body: { family: "navigation-bar", subcomponent: "page", props: { title: "B" } },
      },
    },
    expect: /navigation-bars \(max 1\)/,
  },
  {
    name: "two FABs",
    recipe: {
      slug: "bad-two-fabs",
      name: "Bad",
      description: "two FABs",
      regions: {
        top: { family: "navigation-bar", subcomponent: "home", props: { title: "A" } },
        fab: { family: "button", subcomponent: "fab", props: { label: "Compose" } },
        extra: { family: "button", subcomponent: "fab", props: { label: "Other" } },
      },
    },
    expect: /FABs \(max 1\)/,
  },
  {
    name: "unknown family",
    recipe: {
      slug: "bad-unknown-family",
      name: "Bad",
      description: "unknown",
      regions: {
        body: { family: "not-a-real-family" },
      },
    },
    expect: /family not in manifest/,
  },
  {
    name: "modal with no trigger",
    recipe: {
      slug: "bad-orphan-modal",
      name: "Bad",
      description: "orphan modal",
      regions: {
        top: { family: "navigation-bar", subcomponent: "page", props: { title: "Settings" } },
        body: {
          family: "list",
          props: { variant: "nav" },
          items: [{ value: "profile", label: "Profile" }],
        },
        overlay: {
          family: "bottom-sheet",
          props: { title: "Confirm" },
        },
      },
    },
    expect: /no paired trigger/,
  },
  {
    name: "accepts violation",
    recipe: {
      slug: "bad-accepts",
      name: "Bad",
      description: "accepts violation",
      regions: {
        top: {
          family: "navigation-bar",
          subcomponent: "home",
          props: {
            title: "A",
            trailingActions: { family: "list" },
          },
        },
      },
    },
    expect: /not in accepts/,
  },
];

let failures = 0;

for (const c of cases) {
  const tmp = mkdtempSync(join(tmpdir(), "chorus-screen-tests-"));
  const recipePath = join(tmp, `${c.recipe.slug}.screen.json`);
  writeFileSync(recipePath, JSON.stringify(c.recipe));

  const synthManifest = {
    ...REAL_MANIFEST,
    screens: [{ slug: c.recipe.slug, root: recipePath }],
  };
  const manifestPath = join(tmp, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(synthManifest));

  let output = "";
  let exitCode = 0;
  try {
    output = execSync(`node ${VALIDATOR} ${c.recipe.slug}`, {
      env: { ...process.env, CHORUS_MANIFEST_OVERRIDE: manifestPath },
      stdio: ["ignore", "pipe", "pipe"],
    }).toString();
  } catch (e) {
    output = (e.stdout?.toString() ?? "") + (e.stderr?.toString() ?? "");
    exitCode = e.status ?? 1;
  }

  rmSync(tmp, { recursive: true, force: true });

  const matched = c.expect.test(output);
  if (matched && exitCode !== 0) {
    console.log(`✓ ${c.name}`);
  } else {
    failures += 1;
    console.log(`✗ ${c.name}`);
    console.log(`  expected /${c.expect.source}/, got exit=${exitCode}:`);
    console.log(output.split("\n").map((l) => "    " + l).join("\n"));
  }
}

if (failures > 0) {
  console.log(`\n${failures} test failure(s)`);
  process.exit(1);
}
console.log(`\nAll ${cases.length} cases passed`);
