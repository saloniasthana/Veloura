import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { serializeOrder } from "@/lib/order-serialize";
import { ORDER_STATUSES } from "@/lib/orders";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.userId) {
    const session = await getSession();
    const isOwner = session?.sub === order.userId;
    const isAdmin = session?.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
  }

  return NextResponse.json({ order: serializeOrder(order) });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status;

  if (!ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const order = await db.order
    .update({ where: { id }, data: { status }, include: { items: true } })
    .catch(() => null);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: serializeOrder(order) });
}
