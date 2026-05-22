---
name: compose_kr
image: ./compose_kr.png
status: canonical
recipe: ../schema/screens/compose-kr.screen.json
---

## Intent

Korean-locale expanded compose surface that introduces the *promotion-link* affordance. Same modal frame as [[compose]] / [[compose_offereval]], but the insert toolbar gains a fourth megaphone icon, a teaching coachmark (blue speech-bubble tooltip "📢 홍보 글을 올릴 수 있어요!") points at it, and a right-aligned "3회 남음" quota chip reports remaining promotion attempts. Tapping the megaphone opens [[compose_kr_promotion]] as a bottom sheet (the purchase / activation flow). Body, mention, and option rows are the same shape as the rest of the compose family; localization is incidental, the megaphone + quota + coachmark trio is the load-bearing change.

## Layout

- **Top action bar** — same as [[compose]]: leading `button/text` "취소" (Cancel), trailing `button/text` "등록" (Post) muted while content is empty.
- **Channel picker row** — `list/nav`: leading 4-dot grid icon, placeholder label "채널을 선택해 주세요" (no channel selected yet), trailing chevron-down. Opens [[compose_channel]] as a bottom sheet.
- **Identity row** — `list/text`: leading person icon, "스타트업 • 블라인드유저" (company • alias).
- **Title input** — `form-field/input`, placeholder "제목을 입력해 주세요".
- **Body input** — `form-field/input` multiline, hairline-divided from title. Placeholder copy is policy guidance (off-topic + illegal content warnings).
- **Mention helper row** — `list/text` with leading `@` glyph, secondary text "멘션할 회사, 업계, 직군을 선택하세요."
- **Coachmark overlay** — transient teaching tooltip: blue rounded-rectangle bubble with white label "📢 홍보 글을 올릴 수 있어요!" and a downward arrow point anchored at the megaphone icon below. Auto-dismissing / interaction-dismissed; not in the component library — overlay-only chrome.
- **Invisible to Coworkers band** — `button/check` medium row on the sunken surface band, partially covered by the coachmark in the source screenshot.
- **Insert toolbar** — row of FOUR leading `button/icon` triggers (image attach, `@` mention, `#` hashtag, **megaphone**) with a trailing right-aligned cluster: red "3회 남음" quota text + "회사명 비공개" `button/check` medium. The megaphone is the new affordance; tapping it opens [[compose_kr_promotion]].
- **Keyboard** — system Korean keyboard intrinsic; not part of Chorus.

## Tokens in use

- **color**: "취소" `sys.color.onSurface`; "등록" `sys.color.onSurfaceVariant` while invalid; coachmark bubble on `sys.color.primary` with `sys.color.onPrimary` label; "3회 남음" in `sys.color.brand` (warning/coral) since it is a finite-quota signal; placeholder + helper text `sys.color.onSurfaceVariant`. Invisible-to-Coworkers band on `sys.color.surfaceContainerLow`.
- **spacing**: hairline dividers between picker rows; `sys.layout.stack.md` row gap inside the toolbar.
- **typography**: title input `sys.typo.heading.md` bold; body + helper `sys.typo.body.md`; toolbar quota + checkbox label `sys.typo.label.sm`.
- **radius**: coachmark bubble fully rounded (`sys.radius.lg`+) with arrow point; toolbar icons unbordered.
- **elevation**: coachmark carries `sys.elevation.level2` shadow — floats above the toolbar.

## Components

- [[button/text]] — Cancel + Post in the top action bar.
- [[list/nav]] — channel picker (opens [[compose_channel]] sheet).
- [[list/text]] — identity row, mention helper row.
- [[form-field/input]] — title + body inputs.
- [[button/icon]] — insert toolbar triggers (image, `@`, `#`, megaphone).
- [[button/check]] — "Invisible to Coworkers" and "Hide company name" toggle rows (medium size).
- Coachmark tooltip — out-of-system overlay. See "Not covered" in AGENTS.md; do not synthesize a component on the fly.
- Quota chip ("3회 남음") — currently rendered as plain colored text, not a `chip/*` instance.

## Notes

- This is the Korean-locale pattern. AGENTS.md rule 7 still applies to recipes — demo strings inside the paired [`compose-kr.screen.json`](../schema/screens/compose-kr.screen.json) recipe render English. The Korean copy in this `.md` is the source pattern for visual fidelity only.
- The megaphone icon in the toolbar is the **paired trigger** for the [[compose_kr_promotion]] bottom sheet. AGENTS.md composition rule: every bottom-sheet must have a paired trigger; that trigger lives here.
- The coachmark tooltip is a teaching overlay that points at the megaphone icon — it is *not* a `banner` (no container body content, it is a coachmark with a directional arrow) and not a `toast` (it is anchored to a target element, not screen-bottom). Out-of-system; model as a separate concern, not as a Chorus component.
- "3회 남음" quota is the remaining-attempts indicator. Painted in the brand/warning color to communicate scarcity. When attempts reach zero, this label should soft-pivot to a disabled state (out of scope for this pattern; document on a follow-up promotion-quota pattern if/when it becomes canonical).
- The "실속" yellow tag in [[compose_kr_promotion]] is an out-of-system warm-tone tag (motivation for a future `chip/tag` warm-accent variant). For now, model with a note and keep the visual deviation acknowledged.
