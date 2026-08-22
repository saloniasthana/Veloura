import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { db } from "@/lib/db";
import { toClientProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const row = await db.product.findUnique({ where: { id } });
  if (!row) return {};
  const product = toClientProduct(row);
  return {
    title: `${product.name} — Veloura`,
    description: `Shop the ${product.name} from Veloura's ${product.category.toLowerCase()} edit.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await db.product.findUnique({ where: { id } });
  if (!row) notFound();
  const product = toClientProduct(row);

  const relatedRows = await db.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 4,
  });
  const related = relatedRows.map(toClientProduct);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <ProductDetailClient product={product} related={related} />
      </main>
      <Footer />
    </>
  );
}
