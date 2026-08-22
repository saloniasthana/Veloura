"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useAuth } from "@/lib/auth-context";
import { getOrder, type Order } from "@/lib/orders";

export default function OrderDetailPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/account/login?redirect=/account/orders/${params.id}`);
      return;
    }
    if (user) {
      getOrder(params.id).then((found) => setOrder(found));
    }
  }, [ready, user, router, params.id]);

  if (!ready || !user || order === undefined) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-32" />
        <Footer />
      </>
    );
  }

  if (order === null) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-32 text-center">
          <p className="font-display text-2xl mb-2">Order not found</p>
          <Link
            href="/account/orders"
            className="text-xs tracking-luxe uppercase border-b border-ink pb-0.5"
          >
            Back to Order History
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <p className="text-xs text-stone mb-6">
          <Link href="/account" className="hover:text-ink transition-colors">
            My Account
          </Link>{" "}
          <span className="mx-1.5">/</span>{" "}
          <Link href="/account/orders" className="hover:text-ink transition-colors">
            Order History
          </Link>{" "}
          <span className="mx-1.5">/</span>{" "}
          <span className="text-ink">{order.orderNumber}</span>
        </p>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl md:text-4xl mb-2">{order.orderNumber}</h1>
            <p className="text-sm text-stone">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span className="text-[10px] tracking-luxe uppercase border border-line px-3 py-1.5">
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 xl:gap-16 max-w-4xl">
          <div>
            <p className="text-xs tracking-luxe uppercase mb-4">Shipping To</p>
            <div className="text-sm text-charcoal leading-relaxed border border-line p-6 mb-8">
              <p className="text-ink">{order.address.fullName}</p>
              <p>{order.address.addressLine}</p>
              <p>
                {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
              <p>{order.address.phone}</p>
            </div>

            <p className="text-xs tracking-luxe uppercase mb-4">Payment</p>
            <p className="text-sm text-charcoal capitalize">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
            </p>
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
