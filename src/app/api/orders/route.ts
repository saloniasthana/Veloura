import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { serializeOrder } from "@/lib/order-serialize";

const PHONE_RE = /^[6-9]\d{9}$/;
const PINCODE_RE = /^\d{6}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function generateOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const rand = Math.floor(100000 + Math.random() * 900000);
    const candidate = `VEL-${rand}`;
    const existing = await db.order.findUnique({ where: { orderNumber: candidate } });
    if (!existing) return candidate;
  }
  return `VEL-${Date.now()}`;
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  const scope = req.nextUrl.searchParams.get("scope");

  if (scope === "all") {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }
    const rows = await db.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders: rows.map(serializeOrder) });
  }

  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const rows = await db.order.findMany({
    where: { userId: session.sub },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders: rows.map(serializeOrder) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  const body = await req.json().catch(() => null);

  const items = Array.isArray(body?.items) ? body.items : [];
  const subtotal = Number(body?.subtotal);
  const shippingCost = Number(body?.shippingCost);
  const total = Number(body?.total);
  const shippingMethod = typeof body?.shippingMethod === "string" ? body.shippingMethod : "";
  const paymentMethod = typeof body?.paymentMethod === "string" ? body.paymentMethod : "";
  const address = body?.address ?? {};
  const fullName = typeof address.fullName === "string" ? address.fullName.trim() : "";
  const email = typeof address.email === "string" ? address.email.trim().toLowerCase() : "";
  const phone = typeof address.phone === "string" ? address.phone.trim() : "";
  const addressLine = typeof address.addressLine === "string" ? address.addressLine.trim() : "";
  const city = typeof address.city === "string" ? address.city.trim() : "";
  const state = typeof address.state === "string" ? address.state.trim() : "";
  const pincode = typeof address.pincode === "string" ? address.pincode.trim() : "";

  if (
    items.length === 0 ||
    !Number.isFinite(subtotal) ||
    !Number.isFinite(shippingCost) ||
    !Number.isFinite(total) ||
    fullName.length < 2 ||
    !EMAIL_RE.test(email) ||
    !PHONE_RE.test(phone) ||
    !addressLine ||
    !city ||
    !state ||
    !PINCODE_RE.test(pincode)
  ) {
    return NextResponse.json({ error: "Invalid order details." }, { status: 400 });
  }

  const orderNumber = await generateOrderNumber();

  const order = await db.order.create({
    data: {
      orderNumber,
      userId: session?.sub ?? null,
      subtotal: Math.round(subtotal),
      shippingCost: Math.round(shippingCost),
      total: Math.round(total),
      shippingMethod,
      paymentMethod,
      status: "Processing",
      fullName,
      email,
      phone,
      addressLine,
      city,
      state,
      pincode,
      items: {
        create: items.map((i: { name: string; price: number; quantity: number; size: string; color: string; seed: number }) => ({
          name: String(i.name),
          price: Math.round(Number(i.price)),
          quantity: Math.max(1, Math.round(Number(i.quantity))),
          size: String(i.size),
          color: String(i.color),
          seed: Math.round(Number(i.seed)) || 0,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ order: serializeOrder(order) }, { status: 201 });
}
