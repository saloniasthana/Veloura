import type { Metadata } from "next";
import { Mail, MessageCircle, Clock } from "lucide-react";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Contact Us — Veloura" };

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Contact Us"
      intro="For order questions, styling advice, or anything else — we read every message ourselves."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-line p-6">
          <Mail size={18} strokeWidth={1.5} className="mb-4 text-gold" />
          <p className="text-sm text-ink mb-1">Email</p>
          <a
            href="mailto:hello@veloura.com"
            className="text-sm text-charcoal underline underline-offset-2"
          >
            hello@veloura.com
          </a>
        </div>
        <div className="border border-line p-6">
          <Clock size={18} strokeWidth={1.5} className="mb-4 text-gold" />
          <p className="text-sm text-ink mb-1">Response time</p>
          <p className="text-sm text-charcoal">Within 1 business day</p>
        </div>
        <div className="border border-line p-6">
          <MessageCircle size={18} strokeWidth={1.5} className="mb-4 text-gold" />
          <p className="text-sm text-ink mb-1">Order updates</p>
          <p className="text-sm text-charcoal">Sent via WhatsApp & email</p>
        </div>
      </div>

      <div className="pt-6">
        <h2>Order or sizing questions</h2>
        <p>
          For anything about a specific order, it helps to include your order
          number — you&apos;ll find it in{" "}
          <a href="/account/orders" className="underline underline-offset-2">
            Order History
          </a>
          .
        </p>
      </div>

      <div>
        <h2>Studio</h2>
        <p>Veloura Studio, Andheri West, Mumbai, Maharashtra 400058, India</p>
      </div>
    </InfoPage>
  );
}
