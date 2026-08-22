import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

const PHONE_RE = /^[6-9]\d{9}$/;
const PINCODE_RE = /^\d{6}$/;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const { id } = await params;
  const existing = await db.address.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.sub) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);

  // Set-default-only request
  if (body?.setDefault) {
    await db.address.updateMany({
      where: { userId: session.sub },
      data: { isDefault: false },
    });
    const address = await db.address.update({
      where: { id },
      data: { isDefault: true },
    });
    return NextResponse.json({ address });
  }

  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : existing.fullName;
  const phone = typeof body?.phone === "string" ? body.phone.trim() : existing.phone;
  const addressLine =
    typeof body?.addressLine === "string" ? body.addressLine.trim() : existing.addressLine;
  const city = typeof body?.city === "string" ? body.city.trim() : existing.city;
  const state = typeof body?.state === "string" ? body.state.trim() : existing.state;
  const pincode = typeof body?.pincode === "string" ? body.pincode.trim() : existing.pincode;

  if (
    fullName.length < 2 ||
    !PHONE_RE.test(phone) ||
    !addressLine ||
    !city ||
    !state ||
    !PINCODE_RE.test(pincode)
  ) {
    return NextResponse.json({ error: "Invalid address details." }, { status: 400 });
  }

  const address = await db.address.update({
    where: { id },
    data: { fullName, phone, addressLine, city, state, pincode },
  });

  return NextResponse.json({ address });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const { id } = await params;
  const existing = await db.address.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.sub) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  await db.address.delete({ where: { id } });

  if (existing.isDefault) {
    const remaining = await db.address.findFirst({ where: { userId: session.sub } });
    if (remaining) {
      await db.address.update({ where: { id: remaining.id }, data: { isDefault: true } });
    }
  }

  return NextResponse.json({ success: true });
}
