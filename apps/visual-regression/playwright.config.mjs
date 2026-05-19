import { defineConfig, devices } from "@playwright/test";

// Visual-regression config for the Chorus docs site. We deliberately keep
// the surface area small: a couple of representative pages under one
// viewport, two themes. The point is "catch surprise visual drift" — not
// pixel-perfect coverage of every component.
//
// CI runs against a freshly-built production server; local `npm test` does
// the same so baselines are deterministic. Update baselines with
// `npm --workspace @blind-dsai/visual-regression run update` after auditing a
// real visual change.

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  snapshotPathTemplate: "{testDir}/__snapshots__/{testFilePath}/{arg}{ext}",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",

  expect: {
    // Tight default — small layout shifts (sub-pixel font rendering, etc.)
    // are absorbed; intentional visual changes blow past it and surface as
    // diffs in the PR.
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
    },
  },

  use: {
    baseURL: "http://127.0.0.1:3100",
    viewport: { width: 1280, height: 800 },
    ...devices["Desktop Chrome"],
  },

  webServer: {
    // Build once, serve via `next start` so each test run hits the same
    // static output. The visual-regression run does NOT depend on `next dev`
    // hot-reload, which would introduce non-determinism.
    command: "npm --workspace @blind-dsai/docs run build && npm --workspace @blind-dsai/docs run start -- -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
