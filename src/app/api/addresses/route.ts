import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

const PHONE_RE = /^[6-9]\d{9}$/;
const PINCODE_RE = /^\d{6}$/;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const addresses = await db.address.findMany({
    where: { userId: session.sub },
    orderBy: { isDefault: "desc" },
  });
  return NextResponse.json({ addresses });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const addressLine = typeof body?.addressLine === "string" ? body.addressLine.trim() : "";
  const city = typeof body?.city === "string" ? body.city.trim() : "";
  const state = typeof body?.state === "string" ? body.state.trim() : "";
  const pincode = typeof body?.pincode === "string" ? body.pincode.trim() : "";

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

  const count = await db.address.count({ where: { userId: session.sub } });
  const isDefault = count === 0 || Boolean(body?.isDefault);

  if (isDefault) {
    await db.address.updateMany({
      where: { userId: session.sub },
      data: { isDefault: false },
    });
  }

  const address = await db.address.create({
    data: {
      userId: session.sub,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      isDefault,
    },
  });

  return NextResponse.json({ address }, { status: 201 });
}
