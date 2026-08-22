import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Craftsmanship — Veloura" };

export default function CraftsmanshipPage() {
  return (
    <InfoPage
      eyebrow="About Veloura"
      title="Craftsmanship"
      intro="Every piece passes through hands before it reaches yours — that's not a marketing line, it's how small workshops actually work."
    >
      <div>
        <h2>Cut, not stamped</h2>
        <p>
          Our pattern cutters work from paper patterns refined over multiple
          fittings, not algorithmically nested for maximum yield. It costs
          more fabric. It fits better.
        </p>
      </div>
      <div>
        <h2>Hand-finished details</h2>
        <p>
          Buttonholes, hems, and linings on tailored pieces are finished by
          hand — a skill that takes years to learn and can&apos;t be
          replicated by a machine at speed. It&apos;s slower, and it shows in
          how the garment sits.
        </p>
      </div>
      <div>
        <h2>Workshops, not factories</h2>
        <p>
          We work with a small number of family-run ateliers, several of them
          multi-generational. We visit in person before any partnership
          begins, and again each season — not for a press photo, but because
          quality control on hand-finished work has to happen in the room.
        </p>
      </div>
      <div>
        <h2>Quality control, twice over</h2>
        <p>
          Every finished piece is inspected at the workshop and again before
          it leaves our studio. Anything that doesn&apos;t meet the standard
          doesn&apos;t make it into the Edit.
        </p>
      </div>
    </InfoPage>
  );
}
