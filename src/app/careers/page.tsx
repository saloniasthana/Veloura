import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Careers — Veloura" };

export default function CareersPage() {
  return (
    <InfoPage
      eyebrow="About Veloura"
      title="Careers"
      intro="We're a small team, and we hire slowly — usually when a specific gap in the studio becomes impossible to ignore."
    >
      <div>
        <h2>How we work</h2>
        <p>
          Veloura is run by a small, hands-on team covering design, sourcing,
          and operations. Most of us wear more than one hat, and we&apos;d
          rather stay small and deliberate than scale for its own sake.
        </p>
      </div>
      <div>
        <h2>Open roles</h2>
        <p>
          We don&apos;t have any positions open right now. When we do, we
          post them here first — no recruiters, no job boards.
        </p>
      </div>
      <div>
        <h2>Stay in touch</h2>
        <p>
          If you think you&apos;d be a strong fit for the studio down the
          line — design, pattern-making, or operations — feel free to
          introduce yourself at{" "}
          <a href="mailto:careers@veloura.com" className="underline underline-offset-2">
            careers@veloura.com
          </a>
          . We keep good introductions on file.
        </p>
      </div>
    </InfoPage>
  );
}
