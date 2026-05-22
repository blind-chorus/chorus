---
name: onboarding_kr_personalEmail
image: ./onboarding_kr_personalEmail.png
status: canonical
---

## Intent

Korean-locale variant of [onboarding_personalEmail](onboarding_personalEmail.md). Same friction-sheet purpose — surface the personal-vs-work-email feature trade-off on Sign Up step 1 — with two locale-specific deltas: (1) the body copy names the expected KR personal providers ("네이버, Gmail 등"), and (2) an extra trailing text-link below the action stack ("회사이메일 외에 다른 방법으로 인증하고 싶어요") lets users escape into an alternate verification flow that the EN flow doesn't expose at this step.

## Layout

- **Sheet container** — `bottom-sheet`: drag handle, rounded top corners, scrim over [onboarding](onboarding.md) (KR-localized parent: 회원가입 / 가입을 위해 인증하세요 / 안전한 블라인드 익명로직).
- **Heading** — "개인 이메일로 가입하세요" in `sys.typo.heading.lg`.
- **Body** — paragraph naming KR personal-email providers and warning that some Blind features are restricted.
- **Comparison table** — 2-column / 5-row matrix. Column headers right-aligned: "개인이메일" (active) and "회사이메일" (muted). Rows: *공개 채널의 글 읽기*, *글/댓글 쓰기, 투표 참여, 멘션*, *회사, 업계, 직군 전용 채널 입장*, *내 연봉 등수 확인*, *1:1 & 그룹 대화*. Cells use check / lock / muted-check exactly as in the EN variant.
- **Action stack** — primary `button / standard` "돌아가기" (Go back), outlined accent `button / standard` "개인 이메일로 가입하기" (Continue with personal email).
- **Trailing escape link** — `button / text` "회사이메일 외에 다른 방법으로 인증하고 싶어요" centered below the action stack in accent blue (underlined). Opens an alternate verification path not surfaced in the EN onboarding.

## Tokens in use

- Identical to [onboarding_personalEmail](onboarding_personalEmail.md): sheet surface, `onSurface` / `onSurfaceVariant` for column emphasis, accent-blue role for both the outlined CTA and the trailing text-link.
- **spacing**: row padding `sys.layout.stack.md`; small `sys.layout.stack.sm` gap between the action stack and the trailing text-link.
- **typography**: identical scale to the EN variant.

## Components

- [[bottom-sheet]] — sheet container with handle + scrim over the KR onboarding screen.
- [[button/standard]] — primary "돌아가기" and outlined accent "개인 이메일로 가입하기".
- [[button/text]] — trailing "회사이메일 외에 다른 방법으로 인증하고 싶어요" escape link.

## Notes

- The trailing text-link is the *only* layout difference from [onboarding_personalEmail](onboarding_personalEmail.md). It exists because the KR verification flow has an additional non-email proof channel that the EN flow doesn't; keep this asymmetry intentional.
- Localization: source is Korean. Per AGENTS.md rule 7, demo strings rendered in components should be English; this pattern captures the Korean source for visual fidelity only. When porting to a recipe under `schema/screens/`, the recipe's demo slot content should be English while keeping the EN/KR layout parity captured here.
- Don't merge this with the EN variant via a `locale` prop on a single pattern — patterns are visual references, not parameterized components. The two slugs make the layout delta auditable.
