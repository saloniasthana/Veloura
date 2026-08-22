import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Size Guide — Veloura" };

const APPAREL_SIZES = [
  { size: "XS", bust: "78–81", waist: "60–63", hip: "86–89" },
  { size: "S", bust: "82–85", waist: "64–67", hip: "90–93" },
  { size: "M", bust: "86–90", waist: "68–72", hip: "94–98" },
  { size: "L", bust: "91–96", waist: "73–78", hip: "99–104" },
  { size: "XL", bust: "97–103", waist: "79–85", hip: "105–111" },
];

export default function SizeGuidePage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Size Guide"
      intro="All measurements are in centimetres, taken directly on the body. If you fall between two sizes, we recommend sizing up for a more relaxed fit."
    >
      <div className="border border-line overflow-x-auto">
        <table className="w-full text-sm min-w-105">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-5 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                Size
              </th>
              <th className="px-5 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                Bust
              </th>
              <th className="px-5 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                Waist
              </th>
              <th className="px-5 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                Hip
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {APPAREL_SIZES.map((row) => (
              <tr key={row.size}>
                <td className="px-5 py-3 font-display">{row.size}</td>
                <td className="px-5 py-3 text-charcoal">{row.bust}</td>
                <td className="px-5 py-3 text-charcoal">{row.waist}</td>
                <td className="px-5 py-3 text-charcoal">{row.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-4">
        <h2>How to measure</h2>
        <p>
          <strong className="text-ink">Bust</strong> — measure around the
          fullest part of your chest, keeping the tape level.
        </p>
        <p>
          <strong className="text-ink">Waist</strong> — measure around your
          natural waistline, the narrowest part of your torso.
        </p>
        <p>
          <strong className="text-ink">Hip</strong> — measure around the
          fullest part of your hips, roughly 20cm below your waist.
        </p>
      </div>

      <div>
        <h2>Accessories & footwear</h2>
        <p>
          Bags, belts, and jewellery from the Edit are One Size unless noted
          on the product page. Footwear runs true to standard UK/EU sizing —
          check the size selector on each product for available sizes.
        </p>
      </div>

      <div>
        <h2>Still unsure?</h2>
        <p>
          Write to us at{" "}
          <a href="/contact" className="underline underline-offset-2">
            Contact Us
          </a>{" "}
          with the piece you&apos;re considering and your usual measurements
          — we&apos;re happy to advise before you order.
        </p>
      </div>
    </InfoPage>
  );
}
