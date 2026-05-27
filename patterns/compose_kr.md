---
name: compose_kr
image: ./compose_kr.png
status: canonical
recipe: ../schema/screens/compose-kr.screen.json
---

## Intent

Korean-locale expanded compose surface introducing the *promotion-link* affordance. Same modal frame as [[compose]] / [[compose_offereval]], plus a fourth megaphone icon in the insert toolbar, a teaching coachmark ("📢 홍보 글을 올릴 수 있어요!") pointing at it, and a right-aligned "3회 남음" quota chip. Tapping the megaphone opens [[compose_kr_promotion]] as a bottom sheet. The megaphone + quota + coachmark trio is the load-bearing change.

## Layout

- **Top action bar** — same as [[compose]]: leading `button/text` "취소" (Cancel), trailing `button/text` "등록" (Post) muted while content is empty.
- **Channel picker row** — `list/nav`: leading 4-dot grid icon, placeholder label "채널을 선택해 주세요" (no channel selected yet), trailing chevron-down. Opens [[compose_channel]] as a bottom sheet.
- **Identity row** — `list/text`: leading person icon, "스타트업 • 블라인드유저" (company • alias).
- **Title input** — `form-field/input`, placeholder "제목을 입력해 주세요".
- **Body input** — `form-field/input` multiline, hairline-divided from title. Placeholder copy is policy guidance (off-topic + illegal content warnings).
- **Mention helper row** — `list/text` with leading `@` glyph, secondary text "멘션할 회사, 업계, 직군을 선택하세요."
- **Coachmark overlay** — transient teaching tooltip: blue rounded bubble with white label "📢 홍보 글을 올릴 수 있어요!" and downward arrow anchored to the megaphone icon. Auto/interaction-dismissed; overlay-only chrome, not in the component library.
- **Invisible to Coworkers band** — `button/check` medium row on the sunken surface band.
- **Insert toolbar** — FOUR leading `button/icon` triggers (image attach, `@` mention, `#` hashtag, **megaphone**) with trailing right-aligned cluster: red "3회 남음" quota text + "회사명 비공개" `button/check` medium. Megaphone opens [[compose_kr_promotion]].
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

- Korean-locale pattern. Per AGENTS.md rule 7, demo strings in the paired [`compose-kr.screen.json`](../schema/screens/compose-kr.screen.json) render English; Korean copy here is for visual fidelity only.
- The megaphone icon is the **paired trigger** for the [[compose_kr_promotion]] bottom sheet (AGENTS.md composition rule).
- Coachmark tooltip is *not* a `banner` (directional arrow, no container body) and not a `toast` (anchored to a target). Out-of-system; do not synthesize a Chorus component.
- "3회 남음" is a remaining-attempts indicator in brand/warning color. Soft-pivots to disabled at zero (out of scope here).
- The "실속" yellow tag in [[compose_kr_promotion]] is an out-of-system warm-tone tag — motivation for a future `chip/tag` warm-accent variant.
