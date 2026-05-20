# `src/components/chorus/`

**This folder is the chorus design system surface inside the Lovable repo.**

Contents are generated from the chorus monorepo (`packages/ui/src/`) and synchronized via `scripts/build-lovable.mjs` in that repo. Do not hand-edit files here — the next sync will overwrite them. To change a chorus component, open an issue or PR against the chorus repo, then re-run the export.

## Usage rule

When building UI with the Lovable editor:

1. **Use `@/components/chorus/*` first.** It carries the chorus design language — tokens, spacing, radius, focus rings, color pairs, no-layout strokes — already wired in.
2. Fall back to `@/components/ui/*` (shadcn) only when no chorus equivalent exists for the primitive you need.
3. Never restyle a chorus component with raw Tailwind colors / arbitrary pixel values. If you need a variant that doesn't exist, that is a chorus change — request it upstream rather than patching here.

See the root `AGENTS.md` and `docs/DESIGN.md` for the full design contract.
