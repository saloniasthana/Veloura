import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Our Story — Veloura" };

export default function OurStoryPage() {
  return (
    <InfoPage
      eyebrow="About Veloura"
      title="Our Story"
      intro="Veloura began in 2019 with a simple frustration: too many clothes, too little made to last."
    >
      <div>
        <h2>A quieter way to dress</h2>
        <p>
          We started as a small studio working with a handful of ateliers,
          designing seasonless pieces instead of chasing trend cycles. No
          eight collections a year, no disposable basics — just considered
          garments, released when they&apos;re ready, not when a calendar
          demands it.
        </p>
      </div>
      <div>
        <h2>Where we are now</h2>
        <p>
          Today Veloura works with a small number of family-run workshops
          across India, each chosen for their craft rather than their
          capacity. Every piece in the Edit is still designed in small
          batches — often under 200 units — so that fit, fabric, and finish
          get the attention they deserve.
        </p>
      </div>
      <div>
        <h2>What hasn&apos;t changed</h2>
        <p>
          The name Veloura comes from &ldquo;velour&rdquo; — soft, considered,
          unhurried. That&apos;s still the idea: fewer pieces, made to be
          kept, worn until they&apos;re truly worn out.
        </p>
      </div>
    </InfoPage>
  );
}
