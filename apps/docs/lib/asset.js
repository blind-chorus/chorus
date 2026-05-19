/* Identity passthrough — kept as a seam in case the docs site ever needs
   to ship under a non-root basePath again (GitHub Pages, sub-routed
   reverse proxy). Today Vercel serves the docs at the domain root, so
   `asset(path)` is exactly `path`. */
export const asset = (path) => path;
