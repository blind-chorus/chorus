#!/usr/bin/env node
// Drift guard for the Compose-side token generator. See the iOS sibling
// at packages/tokens-ios/scripts/check.mjs for the rationale.

import { mkdtempSync, readFileSync, readdirSync, statSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const committedDir = resolve(
  here,
  "../chorus-tokens/src/main/kotlin/dev/blinddsai/chorus/tokens/generated",
);
const tmp = mkdtempSync(join(tmpdir(), "chorus-tokens-android-"));

const env = { ...process.env, CHORUS_TOKENS_ANDROID_OUT_DIR: tmp };
const result = spawnSync(process.execPath, [join(here, "codegen.mjs")], {
  env,
  stdio: "inherit",
});
if (result.status !== 0) process.exit(result.status ?? 1);

const collect = (dir) => {
  const out = {};
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isFile()) out[entry] = readFileSync(p, "utf8");
  }
  return out;
};

const left = collect(committedDir);
const right = collect(tmp);
rmSync(tmp, { recursive: true, force: true });

const names = new Set([...Object.keys(left), ...Object.keys(right)]);
const drift = [];
for (const name of names) {
  if (left[name] !== right[name]) drift.push(name);
}

if (drift.length) {
  console.error(
    `[tokens-android:check] Generated sources are out of date. Re-run:\n  node packages/tokens-android/scripts/codegen.mjs\nDrifted files: ${drift.join(", ")}`
  );
  process.exit(1);
}
console.log("[tokens-android:check] generated sources match schema");
