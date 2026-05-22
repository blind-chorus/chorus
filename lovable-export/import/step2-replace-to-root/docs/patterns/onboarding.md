---
name: onboarding
image: ./onboarding.png
status: canonical
---

## Intent

Entry point for new accounts — step 1 of a 5-step Sign Up flow. Steers the user toward the **work-email verification** path (the canonical trust signal for Blind) while keeping two escape hatches visible: federated SSO (Apple / Facebook) and a personal-email fallback that opens [onboarding_personalEmail](onboarding_personalEmail.md). The hierarchy is deliberate: work email lives at the top, social SSO sits under an OR divider, and the personal-email opt-out is parked under the primary Continue so it reads as a last resort, not a peer.

## Layout

- **Header** — `navigation-bar / page`: leading back chevron, centered title "Sign Up", trailing step indicator "1 of 5" in muted weight.
- **Section heading** — display heading "Verify to join the community" in `sys.typo.heading.lg` bold.
- **Trust link row** — leading shield icon + `button / text` "Patented Security & Encryption" in accent blue (underlined). Below it, subhead "To protect anonymity, we do not store emails." in secondary weight. The pair is informational, not a callout surface.
- **Email input** — `form-field / input` with placeholder "Enter work email", full width.
- **OR divider** — horizontal hairline rules flanking a centered "OR" label in `sys.typo.label.sm` secondary. Standard separator-with-label idiom; not a component on its own.
- **SSO buttons** — two stacked `button / standard` (secondary / outlined) with leading brand icons: "Continue with Apple", "Continue with Facebook".
- **Legal footnote** — fine-print paragraph with underlined "Terms of Use" and "Privacy Policy" inline links, pinned above the action stack.
- **Action stack** — bottom-anchored: primary `button / standard` "Continue" (full width, brand primary), then outlined accent `button / standard` "I don't have a work email" that opens [onboarding_personalEmail](onboarding_personalEmail.md).

## Tokens in use

- **color**: page surface `sys.color.surface`; primary CTA + trust link + accent outlined CTA share the accent-blue role (`sys.color.primary` / `sys.color.onPrimary` for filled, accent border + label for outlined). Locked/secondary text uses `sys.color.onSurfaceVariant`.
- **spacing**: vertical rhythm `sys.layout.stack.lg` between the heading block, input, OR divider, SSO stack, and action stack; `sys.layout.stack.md` within each block.
- **typography**: heading `sys.typo.heading.lg`; trust link + buttons `sys.typo.label.lg`; helper + legal `sys.typo.body.sm`; step indicator `sys.typo.label.sm` secondary.
- **radius**: inputs and buttons per their component specs (typically `sys.radius.md`).

## Components

- [[navigation-bar/page]] — Sign Up header with step indicator.
- [[button/text]] — "Patented Security & Encryption" trust link with leading shield icon; inline legal links.
- [[form-field/input]] — work email entry.
- [[button/standard]] — SSO buttons (secondary), primary "Continue", outlined accent "I don't have a work email".

## Notes

- The "1 of 5" indicator is *plain text* in the nav bar trailing slot, not a progress component — keep it that way until a stepper pattern is canonized.
- "I don't have a work email" intentionally uses an *outlined accent* style, not text-button: the action is consequential enough to need button affordance, but visually subordinate to the primary "Continue".
- Apple/Facebook brand glyphs render at their authentic colors (Apple monochrome, Facebook blue dot) — they are vendor marks, not theme tokens. Don't recolor.
- Localization: source is English. This is the only onboarding pattern currently captured in English; KR variants will get their own slug when added.
