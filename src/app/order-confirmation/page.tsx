"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import { getOrder, type Order } from "@/lib/orders";

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!orderId) {
      router.replace("/shop");
      return;
    }
    getOrder(orderId).then((found) => {
      if (!found) {
        router.replace("/shop");
        return;
      }
      setOrder(found);
    });
  }, [orderId, router]);

  if (order === undefined || order === null) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-32" />
        <Footer />
      </>
    );
  }

  const eta = order.shippingMethod === "express" ? "2–3 business days" : "5–7 business days";

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="max-w-lg mx-auto text-center mb-12">
          <CheckCircle2 size={40} strokeWidth={1.2} className="text-gold mx-auto mb-5" />
          <p className="text-xs tracking-luxe uppercase text-gold mb-3">
            Order Confirmed
          </p>
          <h1 className="font-display text-3xl md:text-4xl mb-4">
            Thank you, {order.address.fullName.split(" ")[0]}.
          </h1>
          <p className="text-sm text-charcoal">
            Your order <span className="text-ink">{order.orderNumber}</span> has been placed
            and will arrive in {eta}. A confirmation has been sent to{" "}
            {order.address.email}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 xl:gap-16 max-w-4xl mx-auto">
          <div>
            <p className="text-xs tracking-luxe uppercase mb-4">
              Shipping To
            </p>
            <div className="text-sm text-charcoal leading-relaxed border border-line p-6">
              <p className="text-ink">{order.address.fullName}</p>
              <p>{order.address.addressLine}</p>
              <p>
                {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
              <p>{order.address.phone}</p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center border border-ink text-xs tracking-luxe uppercase px-8 py-3.5 mt-8 hover:bg-ink hover:text-ivory transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>

          <OrderSummary
            items={order.items}
            subtotal={order.subtotal}
            shippingCost={order.shippingCost}
            total={order.total}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
