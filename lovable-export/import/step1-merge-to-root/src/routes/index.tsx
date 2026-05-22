/* Seed route — the canonical "how a Chorus screen is composed" example.
 *
 * Lovable, Cursor, and Claude infer house style from existing routes. This
 * file is therefore the reference pattern: a mobile screen built entirely
 * from `@/components/chorus/*`, with no raw HTML primitives, no inline
 * hex, and no Tailwind color utilities. New routes should mirror this
 * shape — pick chorus components by intent (see `docs/catalog.md`), fill
 * their slots, and let the token layer handle color/spacing/typography.
 */

import { createFileRoute } from "@tanstack/react-router";
import {
  NavigationBar,
  Section,
  Feed,
  Callout,
  Button,
  Chip,
  List,
} from "@/components/chorus";

export const Route = createFileRoute("/")({
  component: Index,
});

const FILTERS = ["전체", "공학", "디자인", "PM", "데이터"];

function Index() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--sys-color-surface)", color: "var(--sys-color-onSurface)" }}
    >
      <NavigationBar
        variant="page"
        title="커리어 로드맵"
        leading={{ icon: "‹", "aria-label": "Back" }}
        trailing={{ label: "변경", onClick: () => {} }}
      />

      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 pt-2 pb-16">
        <Callout
          appearance="accent"
          action={{ label: "내 연봉 등수 알아보기", href: "#" }}
        >
          소프트웨어 엔지니어 · 신입 평균 4,200~5,500만원 (0~2년차, Blind 보고서 기반)
        </Callout>

        <Section
          label="이 직무로 많이 가는 회사"
          headerAction={{ label: "전체 보기", href: "#" }}
        >
          <List
            variant="thumbnail"
            items={[
              {
                value: "naver",
                thumbnail: { src: "/placeholder_thumbnail.png", alt: "네이버" },
                label: "네이버",
                supportingText: "★ 4.1 · 8,421 리뷰 · 워라밸 · 급여복지",
              },
              {
                value: "kakao",
                thumbnail: { src: "/placeholder_thumbnail.png", alt: "카카오" },
                label: "카카오",
                supportingText: "★ 3.9 · 6,530 리뷰 · 수평문화 · 성장",
              },
              {
                value: "coupang",
                thumbnail: { src: "/placeholder_thumbnail.png", alt: "쿠팡" },
                label: "쿠팡",
                supportingText: "★ 3.4 · 7,812 리뷰 · 연봉 · 강도높음",
              },
            ]}
          />
        </Section>

        <Section label="주제별 깊게 보기">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((label, i) => (
              <Chip key={label} variant="filter" selected={i === 0}>
                {label}
              </Chip>
            ))}
          </div>
        </Section>

        <Section
          label="지금 이 단계에서 꼭 볼 글"
          headerAction={{ label: "더 보기", href: "#" }}
        >
          <div className="flex flex-col gap-3">
            <Feed
              flag="준비 시작 단계 추천"
              channel="컴공 커뮤니티"
              channelHref="#"
              timestamp="2일 전"
              avatar={{ src: "/placeholder_thumbnail.png", alt: "컴공" }}
              title="컴공 2학년이 6개월 만에 첫 포트폴리오 만든 순서 공개"
              body="처음 잡은 사이드 프로젝트부터 GitHub README 다듬기까지, 신입 SWE 자소서에 실제로 통과한 흐름을 정리했어요."
              thumbnail={{ src: "/placeholder_thumbnail.png", alt: "포트폴리오" }}
              engagement={{ likes: 1284, comments: 201, views: 12400 }}
            />
            <Feed
              flag="현직자 첨삭 요약"
              channel="신입 SWE 자소서"
              channelHref="#"
              timestamp="1주 전"
              avatar={{ src: "/placeholder_thumbnail.png", alt: "현직자" }}
              title="신입 SWE 자소서, 이 3가지 빼면 다 비슷합니다"
              body="대기업 4곳, 유니콘 2곳 합격자 자소서를 비교해 보고 공통된 구조와 빼야 할 표현을 정리했습니다."
              engagement={{ likes: 742, comments: 96, views: 8800 }}
            />
          </div>
        </Section>

        <Section label="현직자들이 공통으로 말하는 것">
          <div className="flex flex-col gap-3">
            <Callout action={{ label: "관련 원문 보기", href: "#" }}>
              백준 골드 못 가도 SWE 취업은 됩니다 — 코딩테스트보다 “문제를 끝까지 푸는 사람”인지를 더 봅니다.
            </Callout>
            <Callout action={{ label: "관련 원문 보기", href: "#" }}>
              포트폴리오는 양보다 “왜 이걸 만들었는지” 한 줄이 있는 프로젝트 두 개가 더 강합니다.
            </Callout>
          </div>
        </Section>

        <div className="flex justify-end">
          <Button variant="text" appearance="accent">
            다음 단계로 →
          </Button>
        </div>
      </main>
    </div>
  );
}
