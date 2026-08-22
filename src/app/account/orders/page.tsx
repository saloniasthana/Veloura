"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { getMyOrders, type Order } from "@/lib/orders";

export default function OrdersPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/account/login?redirect=/account/orders");
      return;
    }
    if (user) getMyOrders().then(setOrders);
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-32" />
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
          <span className="text-ink">Order History</span>
        </p>
        <h1 className="font-display text-3xl md:text-4xl mb-10">
          Order History
        </h1>

        {orders.length === 0 ? (
          <div className="py-16 text-center border border-line">
            <Package size={28} strokeWidth={1.2} className="mx-auto mb-4 text-stone" />
            <p className="font-display text-2xl mb-2">No orders yet</p>
            <p className="text-sm text-stone mb-6">
              Your placed orders will appear here.
            </p>
            <Link
              href="/shop"
              className="text-xs tracking-luxe uppercase border-b border-ink pb-0.5"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="max-w-3xl space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between border border-line px-6 py-5 hover:border-ink transition-colors"
              >
                <div>
                  <p className="text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-stone mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {order.items.reduce((n, i) => n + i.quantity, 0)} item
                    {order.items.reduce((n, i) => n + i.quantity, 0) > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] tracking-luxe uppercase border border-line px-2.5 py-1">
                    {order.status}
                  </span>
                  <p className="text-sm">₹{order.total.toLocaleString("en-IN")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
