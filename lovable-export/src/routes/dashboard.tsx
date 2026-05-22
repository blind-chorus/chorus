/* Desktop dashboard seed — companion to `/` (the mobile Korean seed).
 *
 * Lovable, Cursor, and Claude generalize "house style" from existing
 * routes. The Korean mobile seed risks teaching them "chorus = Korean
 * mobile widget"; this desktop English route is the second data point
 * that says "chorus is the primitive set, layout is up to you."
 *
 * What this route demonstrates:
 * - English copy on chorus components (per AGENTS.md §7).
 * - A wider canvas (max-w-5xl) with a multi-column main region.
 * - Composition by intent: NavigationBar(home) → Section → List/Feed/Callout.
 * - Tokens drive surface/foreground; no Tailwind color utilities, no hex.
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

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--sys-color-surface)", color: "var(--sys-color-onSurface)" }}
    >
      <NavigationBar
        variant="home"
        title="Career Dashboard"
        trailingActions={
          <Button variant="text" appearance="accent">
            Settings
          </Button>
        }
      />

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pt-6 pb-16">
        <Callout
          appearance="accent"
          action={{ label: "Check my salary band", href: "#" }}
        >
          Software Engineer · Entry-level pay range $80k–$110k (0–2 yrs, Blind report).
        </Callout>

        <div className="grid gap-6 md:grid-cols-2">
          <Section
            label="Companies hiring this role"
            headerAction={{ label: "View all", href: "#" }}
          >
            <List
              variant="thumbnail"
              items={[
                {
                  value: "acme",
                  thumbnail: { src: "/placeholder_thumbnail.png", alt: "Acme" },
                  label: "Acme",
                  supportingText: "★ 4.1 · 8,421 reviews · Work-life · Comp",
                },
                {
                  value: "globex",
                  thumbnail: { src: "/placeholder_thumbnail.png", alt: "Globex" },
                  label: "Globex",
                  supportingText: "★ 3.9 · 6,530 reviews · Flat culture · Growth",
                },
                {
                  value: "initech",
                  thumbnail: { src: "/placeholder_thumbnail.png", alt: "Initech" },
                  label: "Initech",
                  supportingText: "★ 3.4 · 7,812 reviews · Pay · Intensity",
                },
              ]}
            />
          </Section>

          <Section label="What seniors keep repeating">
            <div className="flex flex-col gap-3">
              <Callout action={{ label: "Read original", href: "#" }}>
                You don't need to grind LeetCode Gold to land an SWE role — companies care more about whether you finish a problem than the exact rank.
              </Callout>
              <Callout action={{ label: "Read original", href: "#" }}>
                A portfolio of two projects with a clear "why I built it" line beats a stack of five generic clones.
              </Callout>
            </div>
          </Section>
        </div>

        <Section
          label="Recommended reads at this stage"
          headerAction={{ label: "See more", href: "#" }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Feed
              flag="Starter pick"
              channel="CS Community"
              channelHref="#"
              timestamp="2 days ago"
              avatar={{ src: "/placeholder_thumbnail.png", alt: "CS" }}
              title="How a CS sophomore shipped a portfolio in six months"
              body="From first side project to a polished GitHub README — the actual sequence that landed entry-level SWE interviews."
              thumbnail={{ src: "/placeholder_thumbnail.png", alt: "Portfolio" }}
              engagement={{ likes: 1284, comments: 201, views: 12400 }}
            />
            <Feed
              flag="Practitioner notes"
              channel="SWE Resume Review"
              channelHref="#"
              timestamp="1 week ago"
              avatar={{ src: "/placeholder_thumbnail.png", alt: "Reviewer" }}
              title="Three things to cut from every entry-level SWE resume"
              body="Four big-tech and two unicorn offer letters compared — the structural patterns that survive and the phrases that always get cut."
              engagement={{ likes: 742, comments: 96, views: 8800 }}
            />
          </div>
        </Section>

        <div className="flex justify-end">
          <Button variant="text" appearance="accent">
            Continue to next step →
          </Button>
        </div>
      </main>
    </div>
  );
}
