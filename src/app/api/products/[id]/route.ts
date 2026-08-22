import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/session";
import { toClientProduct } from "@/lib/products";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product: toClientProduct(product) });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : existing.name;
  const description =
    typeof body?.description === "string" ? body.description.trim() : existing.description;
  const price = body?.price != null ? Number(body.price) : existing.price;
  const compareAt =
    body?.compareAt === "" || body?.compareAt == null ? null : Number(body.compareAt);
  const category = typeof body?.category === "string" ? body.category : existing.category;
  const sizes = Array.isArray(body?.sizes) ? body.sizes : JSON.parse(existing.sizes);
  const colors = Array.isArray(body?.colors) ? body.colors : JSON.parse(existing.colors);
  const images = Array.isArray(body?.images)
    ? body.images.filter((u: unknown) => typeof u === "string")
    : JSON.parse(existing.images ?? "[]");
  const isNew = body?.isNew != null ? Boolean(body.isNew) : existing.isNew;

  if (!name || !description || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "Missing or invalid product fields." }, { status: 400 });
  }

  const updated = await db.product.update({
    where: { id },
    data: {
      name,
      description,
      price: Math.round(price),
      compareAt: compareAt != null && Number.isFinite(compareAt) ? Math.round(compareAt) : null,
      category,
      sizes: JSON.stringify(sizes),
      colors: JSON.stringify(colors),
      images: JSON.stringify(images),
      isNew,
    },
  });

  return NextResponse.json({ product: toClientProduct(updated) });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  await db.product.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ success: true });
}
