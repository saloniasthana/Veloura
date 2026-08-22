export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  seed: number;
};

export type OrderAddress = {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  status: string;
  address: OrderAddress;
  createdAt: string;
  customerEmail: string;
};

export const ORDER_STATUSES = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type CreateOrderInput = {
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  address: OrderAddress;
};

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create order.");
  const data = await res.json();
  return data.order;
}

export async function getOrder(id: string): Promise<Order | null> {
  const res = await fetch(`/api/orders/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.order;
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders");
  if (!res.ok) return [];
  const data = await res.json();
  return data.orders;
}
