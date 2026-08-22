import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const SIZES_APPAREL = ["XS", "S", "M", "L", "XL"];
const SIZES_ACCESSORY = ["One Size"];

const COLOR_SETS = {
  neutral: [
    { name: "Ivory", hex: "#f8f6f2" },
    { name: "Charcoal", hex: "#4a453e" },
  ],
  earth: [
    { name: "Camel", hex: "#b18a52" },
    { name: "Espresso", hex: "#3a2f28" },
  ],
  mixed: [
    { name: "Ivory", hex: "#f8f6f2" },
    { name: "Camel", hex: "#b18a52" },
    { name: "Black", hex: "#1a1815" },
  ],
};

function description(name: string, category: string) {
  return `The ${name} is cut from considered fabric and finished by hand, designed to move seamlessly from studio to street. Part of Veloura's ${category.toLowerCase()} edit — made in small batches, built to be kept.`;
}

const PRODUCTS = [
  { name: "Silk Wrap Blouse", price: 6200, seed: 0, category: "Women", sizes: SIZES_APPAREL, colors: COLOR_SETS.neutral, isNew: true },
  { name: "Tailored Wool Coat", price: 18500, compareAt: 22000, seed: 1, category: "Women", sizes: SIZES_APPAREL, colors: COLOR_SETS.earth },
  { name: "Leather Crossbody", price: 9800, seed: 2, category: "Accessories", sizes: SIZES_ACCESSORY, colors: COLOR_SETS.earth },
  { name: "Cashmere Knit", price: 11200, seed: 3, category: "Women", sizes: SIZES_APPAREL, colors: COLOR_SETS.mixed, isNew: true },
  { name: "Merino Crewneck", price: 7400, seed: 1, category: "Men", sizes: SIZES_APPAREL, colors: COLOR_SETS.neutral },
  { name: "Tailored Trousers", price: 8600, seed: 2, category: "Men", sizes: SIZES_APPAREL, colors: COLOR_SETS.earth },
  { name: "Structured Blazer", price: 15400, seed: 0, category: "Men", sizes: SIZES_APPAREL, colors: COLOR_SETS.neutral, isNew: true },
  { name: "Suede Belt", price: 3200, seed: 3, category: "Accessories", sizes: SIZES_ACCESSORY, colors: COLOR_SETS.earth },
  { name: "Linen Shirt Dress", price: 9200, compareAt: 11000, seed: 2, category: "Women", sizes: SIZES_APPAREL, colors: COLOR_SETS.mixed },
  { name: "Cotton Poplin Shirt", price: 5600, seed: 1, category: "Men", sizes: SIZES_APPAREL, colors: COLOR_SETS.neutral },
  { name: "Gold-Plated Hoops", price: 4200, seed: 0, category: "Accessories", sizes: SIZES_ACCESSORY, colors: COLOR_SETS.earth, isNew: true },
  { name: "Pleated Midi Skirt", price: 7800, seed: 3, category: "Women", sizes: SIZES_APPAREL, colors: COLOR_SETS.mixed },
  { name: "Wool Overcoat", price: 21000, seed: 1, category: "Men", sizes: SIZES_APPAREL, colors: COLOR_SETS.earth },
  { name: "Silk Pocket Square", price: 1800, seed: 2, category: "Accessories", sizes: SIZES_ACCESSORY, colors: COLOR_SETS.mixed },
  { name: "Ribbed Tank", price: 3400, seed: 0, category: "Women", sizes: SIZES_APPAREL, colors: COLOR_SETS.neutral },
  { name: "Leather Derby Shoes", price: 13600, seed: 3, category: "Men", sizes: ["7", "8", "9", "10", "11"], colors: COLOR_SETS.earth },
];

async function main() {
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.address.deleteMany();
  await db.product.deleteMany();

  for (const p of PRODUCTS) {
    await db.product.create({
      data: {
        name: p.name,
        description: description(p.name, p.category),
        price: p.price,
        compareAt: p.compareAt ?? null,
        category: p.category,
        seed: p.seed,
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        isNew: p.isNew ?? false,
      },
    });
  }
  console.log(`Seeded ${PRODUCTS.length} products.`);

  const adminEmail = "admin@veloura.com";
  const adminPassword = "veloura2026";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Veloura Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`Seeded admin account: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
