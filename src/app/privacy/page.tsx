import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Privacy Policy — Veloura" };

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="Last updated August 2026. This explains what we collect, why, and how it's used."
    >
      <div>
        <h2>What we collect</h2>
        <p>
          When you create an account, we store your name, email address, and
          a securely hashed password — we never store passwords in plain
          text. When you place an order, we collect the shipping address,
          phone number, and order details needed to fulfil it.
        </p>
      </div>
      <div>
        <h2>What we don&apos;t do</h2>
        <p>
          We don&apos;t sell your data to third parties. We don&apos;t share
          your information with advertisers. Payment details are never
          stored on our servers.
        </p>
      </div>
      <div>
        <h2>Cart & wishlist</h2>
        <p>
          Your shopping bag and wishlist are stored locally in your browser,
          not on our servers, so they&apos;re specific to the device
          you&apos;re shopping on.
        </p>
      </div>
      <div>
        <h2>Cookies & sessions</h2>
        <p>
          We use a single essential cookie to keep you signed in securely.
          We don&apos;t use third-party tracking or advertising cookies.
        </p>
      </div>
      <div>
        <h2>Your rights</h2>
        <p>
          You can request a copy of your data, ask us to correct it, or
          request deletion of your account at any time by writing to{" "}
          <a href="/contact" className="underline underline-offset-2">
            Contact Us
          </a>
          .
        </p>
      </div>
    </InfoPage>
  );
}
