/* Prefixes a root-relative path with NEXT_PUBLIC_BASE_PATH when set.
   Needed for raw `<img src>`, `<a href>`, and `metadata.icons` — Next
   auto-prefixes <Link>/<Image>, but plain DOM attributes do not. */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (path) => `${base}${path}`;
