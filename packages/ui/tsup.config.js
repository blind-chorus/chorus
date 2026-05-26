import { defineConfig } from "tsup";
import { cpSync } from "node:fs";
import { spawnSync } from "node:child_process";

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
    // Generate dist/index.d.ts + dist/icons/index.d.ts from schema/components/.
    // Source is .jsx without TS types, so tsup's own `dts` flag cannot derive
    // declarations. The script reads every <sub>.spec.json and emits a typed
    // surface (incl. discriminated unions for multi-sub families).
    const r = spawnSync(process.execPath, ["scripts/build-types.mjs"], {
      stdio: "inherit",
    });
    if (r.status !== 0) throw new Error("build-types failed");
  },
});
