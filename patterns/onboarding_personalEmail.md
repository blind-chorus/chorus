---
name: onboarding_personalEmail
image: ./onboarding_personalEmail.png
status: canonical
---

## Intent

Friction sheet for the personal-email escape hatch on [onboarding](onboarding.md). When the user taps "I don't have a work email" on step 1 of Sign Up, this bottom sheet rises to surface the **feature trade-off** — what they keep with a personal email vs. what unlocks with a verified work email — before they commit. The primary action is intentionally "Go back" (steering toward work-email verification); the personal-email path is the secondary, outlined CTA so it doesn't read as the recommended route.

## Layout

- **Sheet container** — `bottom-sheet`: drag handle, rounded top corners, scrim over [onboarding](onboarding.md) (parent screen visible behind).
- **Heading** — "Use a personal email" in `sys.typo.heading.lg`.
- **Body** — single paragraph in `sys.typo.body.md` explaining the access trade-off ("limited features … verify a work email").
- **Comparison table** — 2-column / 5-row matrix. Column headers right-aligned: "Personal" (active, `onSurface`) and "Work" (muted, `onSurfaceVariant`). Rows: *Read public posts*, *Post and comment*, *Access company channels*, *View compensation data*, *Send private messages*. Cells use:
  - check glyph (`onSurface`) when allowed,
  - lock glyph (`onSurface`) when gated,
  - muted check (`onSurfaceVariant`) for the always-allowed Work column.
  - Hairline separators between rows.
- **Action stack** — primary `button / standard` "Go back" (full width, brand primary), then outlined accent `button / standard` "Continue with personal email".

## Tokens in use

- **color**: sheet surface `sys.color.surface` with `sys.color.onSurface` foreground. Active column header + lock/check glyphs use full-strength `onSurface`; muted column uses `onSurfaceVariant`. Primary CTA + outlined accent CTA share the same accent-blue role as on [onboarding](onboarding.md).
- **spacing**: row padding `sys.layout.stack.md`; sheet inset standard; action stack respects safe-area bottom inset.
- **typography**: heading `sys.typo.heading.lg`; body `sys.typo.body.md`; row labels `sys.typo.body.md`; column headers `sys.typo.label.md`.
- **radius**: sheet top corners `sys.radius.lg`; buttons per Standard Button spec.

## Components

- [[bottom-sheet]] — sheet container with handle + scrim over the parent onboarding screen.
- [[button/standard]] — primary "Go back" and outlined accent "Continue with personal email".

## Notes

- The comparison matrix is *layout*, not a component. Don't extract a `comparison-table` family for this one surface — if a second pattern adopts the same matrix, revisit.
- Primary/secondary ordering is reversed from typical "dismiss-as-secondary" sheets on purpose: the recommended path (Go back → work email) needs the visual weight. Don't flip it to match other sheets.
- Lock vs check glyphs are role-encoded (gated vs allowed), not state-encoded — they don't toggle. Use the icon family's `lock` and `check` glyphs at body line-height.
- The KR locale variant lives at [onboarding_kr_personalEmail](onboarding_kr_personalEmail.md) and adds a trailing text-link escape route — keep the two in sync when either changes.
