import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductShowcase from "@/components/ProductShowcase";
import EditorialSection from "@/components/EditorialSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { toClientProduct } from "@/lib/products";

export default async function Home() {
  const rows = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  const featured = rows.map(toClientProduct);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <CategoryGrid />
        <ProductShowcase products={featured} />
        <EditorialSection />
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
