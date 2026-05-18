/* Single canonical slugifier shared across the docs renderer. Heading anchors,
   side-nav toc entries, and DESIGN.md section lookups must agree byte-for-byte
   on the slug for a given title; keeping this in one place is the cheapest way
   to enforce that. */

export function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
