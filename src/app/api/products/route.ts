import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/session";
import { toClientProduct } from "@/lib/products";

export async function GET() {
  const rows = await db.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products: rows.map(toClientProduct) });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const price = Number(body?.price);
  const compareAt =
    body?.compareAt === "" || body?.compareAt == null ? null : Number(body.compareAt);
  const category = typeof body?.category === "string" ? body.category : "";
  const sizes = Array.isArray(body?.sizes) ? body.sizes : [];
  const colors = Array.isArray(body?.colors) ? body.colors : [];
  const images = Array.isArray(body?.images) ? body.images.filter((u: unknown) => typeof u === "string") : [];
  const isNew = Boolean(body?.isNew);

  if (!name || !description || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "Missing or invalid product fields." }, { status: 400 });
  }
  if (!["Women", "Men", "Accessories"].includes(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }
  if (sizes.length === 0 || colors.length === 0) {
    return NextResponse.json(
      { error: "At least one size and one color are required." },
      { status: 400 }
    );
  }

  const product = await db.product.create({
    data: {
      name,
      description,
      price: Math.round(price),
      compareAt: compareAt != null && Number.isFinite(compareAt) ? Math.round(compareAt) : null,
      category,
      seed: Math.floor(Math.random() * 4),
      sizes: JSON.stringify(sizes),
      colors: JSON.stringify(colors),
      images: JSON.stringify(images),
      isNew,
    },
  });

  return NextResponse.json({ product: toClientProduct(product) }, { status: 201 });
}
