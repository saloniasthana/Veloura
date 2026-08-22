"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";
import type { Order, OrderStatus } from "./orders";

export function useRequireAdmin() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user || user.role !== "ADMIN") {
      router.replace("/admin/login");
    } else {
      setChecked(true);
    }
  }, [ready, user, router]);

  return checked;
}

export async function getAllOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders?scope=all");
  if (!res.ok) return [];
  const data = await res.json();
  return data.orders;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order | null> {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.order;
}

export type CustomerRecord = {
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
};

export async function getAllCustomers(): Promise<CustomerRecord[]> {
  const res = await fetch("/api/admin/customers");
  if (!res.ok) return [];
  const data = await res.json();
  return data.customers;
}
