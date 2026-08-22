"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/lib/wishlist-context";
import type { Product } from "@/lib/products";

export default function WishlistPage() {
  const { ids, ready } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data.products ?? []));
  }, []);

  const products = allProducts.filter((p) => ids.includes(p.id));

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <p className="text-xs tracking-luxe uppercase text-gold mb-3">
          Saved
        </p>
        <h1 className="font-display text-3xl md:text-4xl mb-10">
          Your Wishlist
        </h1>

        {!ready ? null : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-2xl mb-2">
              Your wishlist is empty
            </p>
            <p className="text-sm text-stone mb-6">
              Save pieces you love to find them here later.
            </p>
            <Link
              href="/shop"
              className="text-xs tracking-luxe uppercase border-b border-ink pb-0.5"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
