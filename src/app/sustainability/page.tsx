import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Sustainability — Veloura" };

export default function SustainabilityPage() {
  return (
    <InfoPage
      eyebrow="About Veloura"
      title="Sustainability"
      intro="The most sustainable garment is the one you keep for a decade. Everything here works toward that."
    >
      <div>
        <h2>Materials</h2>
        <p>
          We favour natural, biodegradable fibres — wool, silk, linen, and
          responsibly sourced leather — over synthetics that shed microplastics
          and outlive their wearer by centuries. Where we use blends, it&apos;s
          to improve durability, never to cut cost.
        </p>
      </div>
      <div>
        <h2>Small batches, less waste</h2>
        <p>
          Producing in small runs means we rarely overproduce. We&apos;d
          rather sell out of a piece than discount it into landfill. Offcuts
          from cutting rooms are kept for smaller accessories wherever
          possible.
        </p>
      </div>
      <div>
        <h2>Built to be repaired</h2>
        <p>
          Every Veloura garment is finished with an eye toward longevity —
          reinforced seams, natural buttons, fabric that ages well rather
          than pills and thins. If something needs mending, our workshops
          can often repair it rather than replace it — reach out through{" "}
          <a href="/contact" className="underline underline-offset-2">
            Contact Us
          </a>
          .
        </p>
      </div>
      <div>
        <h2>Still a work in progress</h2>
        <p>
          We don&apos;t think a brand this young should claim to have it all
          figured out. We publish what we do — and what we&apos;re still
          improving — honestly, one collection at a time.
        </p>
      </div>
    </InfoPage>
  );
}
