"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

export default function ProductShowcase({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <p className="text-xs tracking-luxe uppercase text-gold mb-2">
            Curated
          </p>
          <h2 className="font-display text-3xl md:text-4xl">Best Sellers</h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline text-xs tracking-luxe uppercase border-b border-ink pb-0.5"
        >
          View All
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
