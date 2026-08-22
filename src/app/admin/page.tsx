"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRequireAdmin, getAllOrders, getAllCustomers } from "@/lib/admin";
import type { Order } from "@/lib/orders";

export default function AdminOverviewPage() {
  const ready = useRequireAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    if (!ready) return;
    getAllOrders().then(setOrders);
    getAllCustomers().then((customers) => setCustomerCount(customers.length));
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProductCount(data.products?.length ?? 0));
  }, [ready]);

  if (!ready) return null;

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const recent = orders.slice(0, 5);

  const stats = [
    { label: "Total Orders", value: orders.length.toLocaleString("en-IN") },
    { label: "Total Revenue", value: `₹${revenue.toLocaleString("en-IN")}` },
    { label: "Products", value: productCount.toLocaleString("en-IN") },
    { label: "Customers", value: customerCount.toLocaleString("en-IN") },
  ];

  return (
    <AdminLayout>
      <p className="text-xs tracking-luxe uppercase text-gold mb-3">Dashboard</p>
      <h1 className="font-display text-3xl mb-10">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-line p-6">
            <p className="text-xs tracking-luxe uppercase text-stone mb-3">
              {stat.label}
            </p>
            <p className="font-display text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">Recent Orders</h2>
        <Link
          href="/admin/orders"
          className="text-xs tracking-luxe uppercase border-b border-ink pb-0.5"
        >
          View All
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-stone border border-line p-6">
          No orders placed yet.
        </p>
      ) : (
        <div className="border border-line divide-y divide-line">
          {recent.map((order) => (
            <div key={order.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm">{order.orderNumber}</p>
                <p className="text-xs text-stone mt-1">{order.customerEmail}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] tracking-luxe uppercase border border-line px-2.5 py-1">
                  {order.status}
                </span>
                <p className="text-sm w-20 text-right">
                  ₹{order.total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
