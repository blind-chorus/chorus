import { test, expect } from "@playwright/test";

// Visual regression — a small set of curated pages under both themes. Each
// test takes one screenshot named by [page, theme]; the baseline lives in
// `__snapshots__/`. Adding a new surface means adding one entry to PAGES.
//
// Why these surfaces:
//   /                    — landing chrome (NavigationBar + nav rail + body)
//   /components/list     — list component preview matrix (rows / variants)
//   /components/feed     — feed cards (the highest-density composition)
//   /iconography/all     — icon catalog + new FormField search bar
//
// One pre-render hook stabilises animations and waits for fonts to load,
// so the diff is dominated by colour / layout, not transient rendering.

const PAGES = [
  { path: "/", name: "home" },
  { path: "/components/list", name: "list" },
  { path: "/components/feed", name: "feed" },
  { path: "/iconography/all", name: "icons" },
];

const THEMES = ["light", "dark"];

for (const theme of THEMES) {
  for (const { path, name } of PAGES) {
    test(`${name} @ ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => {
        // Set the theme attribute *before* React hydrates so the first paint
        // already matches. Avoids a flash that would diff against baseline.
        try {
          window.localStorage.setItem("chorus-theme", t);
        } catch {}
        document.documentElement.setAttribute("data-theme", t);
      }, theme);

      await page.goto(path, { waitUntil: "networkidle" });

      // Reassert after hydration in case the client overwrites the attribute.
      await page.evaluate((t) => {
        document.documentElement.setAttribute("data-theme", t);
      }, theme);

      // Wait for web fonts so glyph metrics stabilise.
      await page.evaluate(() => document.fonts.ready);

      await expect(page).toHaveScreenshot(`${name}-${theme}.png`, {
        fullPage: true,
      });
    });
  }
}
