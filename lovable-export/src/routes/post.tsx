/* Desktop post-detail seed — third data point alongside `/` (mobile KR)
 * and `/dashboard` (desktop EN overview).
 *
 * Demonstrates a narrow centred reading column at desktop widths
 * (max-w-3xl), and shows how the same chorus components compose into a
 * single-document layout: NavigationBar(page) for the chrome, a single
 * Feed at the top as the lead post, then a stack of Sections holding
 * Callout / List for sidebars-as-rows.
 *
 * English copy throughout (per AGENTS.md §7) so the model doesn't learn
 * "chorus components only carry Korean strings".
 */

import { createFileRoute } from "@tanstack/react-router";
import {
  NavigationBar,
  Section,
  Feed,
  Callout,
  Button,
  List,
} from "@/components/chorus";

export const Route = createFileRoute("/post")({
  component: PostDetail,
});

function PostDetail() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--sys-color-surface)", color: "var(--sys-color-onSurface)" }}
    >
      <NavigationBar
        variant="page"
        title="Career Insights"
        leading={{ icon: "‹", "aria-label": "Back" }}
        trailing={
          <Button variant="text" appearance="accent">
            Share
          </Button>
        }
      />

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pt-6 pb-16">
        <Feed
          flag="Editor's pick"
          channel="SWE Community"
          channelHref="#"
          timestamp="3 hours ago"
          avatar={{ src: "/placeholder_thumbnail.png", alt: "Author" }}
          title="What hiring managers actually look for in a junior SWE"
          body="Four years of interviewing notes condensed. The signal isn't your LeetCode badge — it's whether you can explain trade-offs out loud while writing code."
          thumbnail={{ src: "/placeholder_thumbnail.png", alt: "Hiring panel" }}
          engagement={{ likes: 2147, comments: 318, views: 24500 }}
        />

        <Section label="Top takeaways">
          <div className="flex flex-col gap-3">
            <Callout appearance="accent" action={{ label: "Jump to source", href: "#" }}>
              Speak through your code. Silent candidates who write correct solutions still lose to candidates who narrate trade-offs.
            </Callout>
            <Callout action={{ label: "Jump to source", href: "#" }}>
              One shipped side-project with a clear "why" beats five generic clones. Specificity is the whole signal.
            </Callout>
            <Callout action={{ label: "Jump to source", href: "#" }}>
              Resume bullets that name the metric you moved survive triage. Bullets that name the framework you used don't.
            </Callout>
          </div>
        </Section>

        <Section
          label="Related companies"
          headerAction={{ label: "View all", href: "#" }}
        >
          <List
            variant="thumbnail"
            items={[
              {
                value: "acme",
                thumbnail: { src: "/placeholder_thumbnail.png", alt: "Acme" },
                label: "Acme Engineering",
                supportingText: "32 open SWE roles · ★ 4.1",
              },
              {
                value: "globex",
                thumbnail: { src: "/placeholder_thumbnail.png", alt: "Globex" },
                label: "Globex",
                supportingText: "18 open SWE roles · ★ 3.9",
              },
            ]}
          />
        </Section>

        <div className="flex items-center justify-between">
          <Button variant="text" appearance="accent">
            ← Previous post
          </Button>
          <Button variant="text" appearance="accent">
            Next post →
          </Button>
        </div>
      </main>
    </div>
  );
}
