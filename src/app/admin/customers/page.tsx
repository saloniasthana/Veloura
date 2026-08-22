"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRequireAdmin, getAllCustomers, type CustomerRecord } from "@/lib/admin";

export default function AdminCustomersPage() {
  const ready = useRequireAdmin();
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (ready) getAllCustomers().then(setCustomers);
  }, [ready]);

  const filtered = useMemo(() => {
    if (!query) return customers;
    const q = query.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, query]);

  if (!ready) return null;

  return (
    <AdminLayout>
      <p className="text-xs tracking-luxe uppercase text-gold mb-3">Dashboard</p>
      <h1 className="font-display text-3xl mb-10">Customers</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search name or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-line px-4 py-2.5 text-sm bg-ivory focus:outline-none focus:border-ink transition-colors w-full sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-stone border border-line p-6">
          No customers registered yet.
        </p>
      ) : (
        <div className="border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                  Name
                </th>
                <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                  Email
                </th>
                <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                  Orders
                </th>
                <th className="px-6 py-3 text-xs tracking-luxe uppercase text-stone font-normal">
                  Total Spent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((c) => (
                <tr key={c.email}>
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4 text-stone">{c.email}</td>
                  <td className="px-6 py-4">{c.orderCount}</td>
                  <td className="px-6 py-4">₹{c.totalSpent.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
