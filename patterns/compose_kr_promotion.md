---
name: compose_kr_promotion
image: ./compose_kr_promotion.png
status: canonical
recipe: ../schema/screens/compose-kr-promotion.screen.json
---

## Intent

Bottom-sheet purchase/activation flow for the *promotion-link* affordance — opened from the megaphone icon in [[compose_kr]]. Teaches the item (preview illustration + description banner) then commits via two pricing rows (5-pack + 1-pack) and a primary "구매하기" / secondary "나중에" action stack. Modal — never inline.

## Layout

- **Sheet handle** — top center drag handle; intrinsic to `bottom-sheet`.
- **Sheet title** — "홍보 링크 추가하기" (Add Promotion Link) left-aligned, `sys.typo.heading.lg` bold.
- **Preview illustration** — mock post card with coral "📢 홍보해요" pill, post title, hairline body strokes, and inline link card (`blind` wordmark + "링크 타이틀이 표시됩니다" + `example.com`). Decorative, not a live Feed item; softly outlined container quotes the feed.
- **Description banner** — `banner`, pale-blue surface (`sys.color.primaryContainer`-ish) with `sys.color.primary` foreground. Body: "특정 채널에서 URL이 포함된 게시글을 등록할 수 있는 아이템입니다. 게시글 제목 앞에 특별한 레이블이 표시되어, 글 목록에서 더욱 눈에 띄게 노출됩니다."
- **Section header** — "구매상품" (Purchase Items), `sys.typo.label.md` secondary.
- **Pricing rows** — two `list/text` rows on outlined card surfaces, stacked:
  - **5-pack (selected)** — leading "실속" warm-yellow tag (out-of-system; see Notes), label "홍보 링크 추가하기 5회권", trailing red "20% OFF" eyebrow + coin glyph + "280". Border `sys.color.primary` (selected).
  - **1-pack (default)** — label "홍보 링크 추가하기 1회권", trailing coin glyph + "70". Border `sys.color.outline`.
- **Disclosure section** — heading "구매 전 꼭 읽어주세요!" then secondary-color body describing target users ("소상공인이나 모임 주최자 등…").
- **Action stack** — pinned bottom:
  - **Primary CTA** — `button/standard` full-width "구매하기", `sys.color.primary` background + `sys.color.onPrimary` label.
  - **Secondary CTA** — `button/standard` full-width "나중에", neutral surface + `sys.color.onSurface` label.

## Tokens in use

- **color**: sheet surface `sys.color.surface`; title `sys.color.onSurface`; description banner uses primary container pair (`sys.color.primaryContainer` background + `sys.color.primary` foreground); selected pricing row border `sys.color.primary`; default pricing row border `sys.color.outline`; "20% OFF" eyebrow + promotion "홍보해요" pill in `sys.color.brand` with `sys.color.onBrand` label; coin glyph in warm gold (out-of-system); primary CTA `sys.color.primary` background.
- **spacing**: section gap `sys.layout.stack.lg`; pricing rows separated by `sys.layout.stack.md`; CTA stack hugs the safe area.
- **typography**: sheet title `sys.typo.heading.lg` bold; section headers `sys.typo.label.md`; row label `sys.typo.body.md`; row price `sys.typo.label.lg`; disclosure heading `sys.typo.label.md`; disclosure body `sys.typo.body.sm` secondary.
- **radius**: sheet top corners `sys.radius.lg`; pricing row cards `sys.radius.md`; primary + secondary CTAs `sys.radius.md`.

## Components

- [[bottom-sheet]] — host surface with drag handle.
- [[banner]] — description block (pale-primary surface variant).
- [[list/text]] — pricing rows (label + trailing meta + leading tag on the 5-pack row).
- [[chip/tag]] — leading "실속" tag on the 5-pack row (warm-yellow appearance, out-of-system — see Notes).
- [[button/standard]] — primary + secondary CTAs in the action stack.
- "📢 홍보해요" promotion pill in the preview illustration — a decorative coral pill, modeled as `chip/tag` with the brand-color pair (out-of-system warm/coral tag; sibling motivation to the warm-yellow case).

## Notes

- Paired trigger: the megaphone `button/icon` in [[compose_kr]]'s insert toolbar.
- "실속" yellow tag and "📢 홍보해요" coral pill are **out-of-system warm/coral tag treatments** — `chip/tag` ships only `neutral` and `accent` (blue). Document the deviation; do not synthesize new appearances. Motivation for future `appearance: warm` / `appearance: brand`.
- Preview illustration is **decorative chrome**, not a live [[feed]] item. Do not model the inner card as `feed/feed`.
- Bottom CTAs are a **stacked action pair** using full-width `button/standard` siblings (not inline `primaryAction`/`secondaryAction` on `bottom-sheet`) because purchase commit is this screen's whole purpose.
- Demo strings in the paired [`compose-kr-promotion.screen.json`](../schema/screens/compose-kr-promotion.screen.json) render English per AGENTS.md rule 7; Korean here is for visual fidelity only.
