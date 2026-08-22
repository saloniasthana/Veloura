import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Returns & Exchanges — Veloura" };

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Returns & Exchanges"
      intro="Free returns and exchanges within 14 days of delivery, on unworn pieces with tags attached."
    >
      <div>
        <h2>How to start a return</h2>
        <p>
          Sign in and go to{" "}
          <Link href="/account/orders" className="underline underline-offset-2">
            Order History
          </Link>
          , open the relevant order, and let us know which piece you&apos;d
          like to return or exchange. We&apos;ll email a prepaid return label
          within one business day.
        </p>
      </div>
      <div>
        <h2>Condition</h2>
        <p>
          Items must be unworn, unwashed, and returned with all original tags
          attached. Final sale items and made-to-order pieces are not
          eligible for return.
        </p>
      </div>
      <div>
        <h2>Refunds</h2>
        <p>
          Once your return is received and inspected, refunds are issued to
          your original payment method within 5–7 business days. Shipping
          charges from the original order are non-refundable.
        </p>
      </div>
      <div>
        <h2>Exchanges</h2>
        <p>
          Need a different size or colour? Note it when you start your
          return and we&apos;ll prioritise dispatching the replacement as
          soon as your original piece is on its way back to us.
        </p>
      </div>
      <div>
        <h2>Questions</h2>
        <p>
          Reach out anytime through{" "}
          <Link href="/contact" className="underline underline-offset-2">
            Contact Us
          </Link>
          .
        </p>
      </div>
    </InfoPage>
  );
}
