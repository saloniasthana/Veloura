import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Terms of Service — Veloura" };

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="Last updated August 2026. By using veloura.com or placing an order, you agree to the following."
    >
      <div>
        <h2>Orders & pricing</h2>
        <p>
          All prices are listed in Indian Rupees (₹) and include applicable
          taxes unless stated otherwise. We reserve the right to correct
          pricing errors and to limit order quantities.
        </p>
      </div>
      <div>
        <h2>Shipping</h2>
        <p>
          Standard shipping is complimentary on orders above ₹4,999.
          Estimated delivery windows are shown at checkout and are not
          guaranteed delivery dates.
        </p>
      </div>
      <div>
        <h2>Returns</h2>
        <p>
          Returns and exchanges are accepted within 14 days of delivery on
          unworn items with tags attached. Full details are on our{" "}
          <a href="/returns" className="underline underline-offset-2">
            Returns & Exchanges
          </a>{" "}
          page.
        </p>
      </div>
      <div>
        <h2>Accounts</h2>
        <p>
          You&apos;re responsible for keeping your account credentials
          confidential. Notify us immediately if you suspect unauthorised
          access to your account.
        </p>
      </div>
      <div>
        <h2>Intellectual property</h2>
        <p>
          All content on this site — photography, product designs, and
          copy — belongs to Veloura and may not be reproduced without
          permission.
        </p>
      </div>
      <div>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href="/contact" className="underline underline-offset-2">
            Contact Us
          </a>
          .
        </p>
      </div>
    </InfoPage>
  );
}
