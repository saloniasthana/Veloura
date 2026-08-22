import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/session";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    include: { orders: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    customers: customers.map((c) => ({
      name: c.name,
      email: c.email,
      orderCount: c.orders.length,
      totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
    })),
  });
}
