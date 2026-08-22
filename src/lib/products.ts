export type Category = "Women" | "Men" | "Accessories";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAt?: number | null;
  seed: number;
  category: Category;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  isNew: boolean;
  createdAt: string;
};

type DbProductRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAt: number | null;
  seed: number;
  category: string;
  sizes: string;
  colors: string;
  images: string;
  isNew: boolean;
  createdAt: Date;
};

export function toClientProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    compareAt: row.compareAt,
    seed: row.seed,
    category: row.category as Category,
    sizes: JSON.parse(row.sizes),
    colors: JSON.parse(row.colors),
    images: JSON.parse(row.images ?? "[]"),
    isNew: row.isNew,
    createdAt: row.createdAt.toISOString(),
  };
}

export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "One Size"];
export const ALL_COLORS = [
  { name: "Ivory", hex: "#f8f6f2" },
  { name: "Charcoal", hex: "#4a453e" },
  { name: "Camel", hex: "#b18a52" },
  { name: "Espresso", hex: "#3a2f28" },
  { name: "Black", hex: "#1a1815" },
];
export const CATEGORIES: Category[] = ["Women", "Men", "Accessories"];
export const MAX_PRICE = 25000;

export function productDetails(p: Product): string[] {
  return [
    `Available in ${p.colors.map((c) => c.name).join(", ")}`,
    `Sizes: ${p.sizes.join(", ")}`,
    "Ethically sourced materials, finished by hand",
    "Model is 5'10\" and wears size M",
  ];
}
