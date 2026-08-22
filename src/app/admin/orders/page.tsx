"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRequireAdmin, getAllOrders, updateOrderStatus } from "@/lib/admin";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/orders";

const FILTERS = ["All", ...ORDER_STATUSES] as const;

export default function AdminOrdersPage() {
  const ready = useRequireAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (ready) getAllOrders().then(setOrders);
  }, [ready]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== "All" && o.status !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !o.orderNumber.toLowerCase().includes(q) &&
          !o.customerEmail.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [orders, filter, query]);

  if (!ready) return null;

  async function handleStatusChange(order: Order, status: OrderStatus) {
    const updated = await updateOrderStatus(order.id, status);
    if (!updated) return;
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
  }

  return (
    <AdminLayout>
      <p className="text-xs tracking-luxe uppercase text-gold mb-3">Dashboard</p>
      <h1 className="font-display text-3xl mb-10">Orders</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-2 border transition-colors ${
                filter === f
                  ? "border-ink bg-ink text-ivory"
                  : "border-line text-charcoal hover:border-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search order ID or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-line px-4 py-2.5 text-sm bg-ivory focus:outline-none focus:border-ink transition-colors w-full sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-stone border border-line p-6">No orders found.</p>
      ) : (
        <div className="border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                  Order
                </th>
                <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                  Customer
                </th>
                <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                  Date
                </th>
                <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                  Total
                </th>
                <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-stone">{order.customerEmail}</td>
                  <td className="px-6 py-4 text-stone">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">₹{order.total.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order, e.target.value as OrderStatus)
                      }
                      className="text-xs border border-line px-2.5 py-1.5 bg-ivory focus:outline-none focus:border-ink"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
