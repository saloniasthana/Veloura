type OrderItemRow = {
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  seed: number;
};

type OrderRow = {
  id: string;
  orderNumber: string;
  items: OrderItemRow[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  status: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: Date;
  userId: string | null;
};

export function serializeOrder(row: OrderRow) {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    items: row.items.map((i) => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      seed: i.seed,
    })),
    subtotal: row.subtotal,
    shippingCost: row.shippingCost,
    total: row.total,
    shippingMethod: row.shippingMethod,
    paymentMethod: row.paymentMethod,
    status: row.status,
    address: {
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      addressLine: row.addressLine,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
    },
    createdAt: row.createdAt.toISOString(),
    customerEmail: row.email,
  };
}
