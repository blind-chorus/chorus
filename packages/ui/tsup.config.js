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
  },
});
