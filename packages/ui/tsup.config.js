import { defineConfig } from "tsup";
import { cpSync } from "node:fs";

export default defineConfig({
  entry: {
    index: "src/index.js",
    "icons/index": "src/icons/index.js",
  },
  format: ["esm", "cjs"],
  outDir: "dist",
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ["react", "react-dom", "@blind-dsai/tokens"],
  loader: { ".jsx": "jsx", ".js": "jsx" },
  esbuildOptions(options) {
    options.jsx = "automatic";
    options.jsxImportSource = "react";
  },
  onSuccess: async () => {
    cpSync("src/styles.css", "dist/styles.css");
    // Generate dist/index.d.{ts,cts} + dist/icons/index.d.{ts,cts} from
    // schema/components/<family>/<sub>.spec.json. The import path is wrapped
    // in a URL hop so esbuild does NOT see it as a static import and try to
    // bundle the script (which has a shebang esbuild would reject). The
    // script then resolves its own paths off import.meta.url, so tsup's cwd
    // doesn't matter — runs the same from packages/ui or repo root. Using
    // import() (not spawnSync) skips a fresh-Node startup, saving ~120ms.
    const buildTypesUrl = new URL("./scripts/build-types.mjs", import.meta.url).href;
    await import(buildTypesUrl);
  },
});
