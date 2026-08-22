"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Minus, Plus, Truck, RotateCcw } from "lucide-react";
import Gallery from "./Gallery";
import Accordion from "./Accordion";
import ProductCard from "../ProductCard";
import { productDetails, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const wishlisted = has(product.id);

  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  function handleAddToBag() {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        compareAt: product.compareAt ?? undefined,
        seed: product.seed,
        size: selectedSize,
        color: selectedColor,
      },
      quantity
    );
  }

  return (
    <>
      <p className="text-xs text-stone mb-6">
        <Link href="/" className="hover:text-ink transition-colors">
          Home
        </Link>{" "}
        <span className="mx-1.5">/</span>{" "}
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-ink transition-colors"
        >
          {product.category}
        </Link>{" "}
        <span className="mx-1.5">/</span>{" "}
        <span className="text-ink">{product.name}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 xl:gap-20">
        <Gallery seed={product.seed} images={product.images} label={product.name} />

        <div>
          <p className="text-xs tracking-luxe uppercase text-stone mb-2">
            {product.category}
          </p>
          <h1 className="font-display text-3xl md:text-4xl mb-4">
            {product.name}
          </h1>
          <p className="text-lg mb-6">
            {product.compareAt ? (
              <>
                <span className="line-through text-stone mr-3">
                  ₹{product.compareAt.toLocaleString("en-IN")}
                </span>
                <span className="text-gold">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <>₹{product.price.toLocaleString("en-IN")}</>
            )}
          </p>

          <div className="mb-6">
            <p className="text-xs tracking-luxe uppercase mb-3">
              Color — <span className="text-stone">{selectedColor}</span>
            </p>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  aria-label={color.name}
                  title={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`h-9 w-9 rounded-full border-2 transition-all ${
                    selectedColor === color.name
                      ? "border-gold"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs tracking-luxe uppercase">
                Size {selectedSize ? `— ${selectedSize}` : ""}
              </p>
              <Link
                href="/size-guide"
                className="text-xs text-stone underline underline-offset-2"
              >
                Size Guide
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`text-xs min-w-11 px-3 py-2.5 border transition-colors ${
                    selectedSize === size
                      ? "border-ink bg-ink text-ivory"
                      : "border-line text-charcoal hover:border-ink"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError ? (
              <p className="text-xs text-red-700 mt-2">
                Please select a size to continue.
              </p>
            ) : null}
          </div>

          <div className="mb-6">
            <p className="text-xs tracking-luxe uppercase mb-3">Quantity</p>
            <div className="inline-flex items-center border border-line">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 hover:text-gold transition-colors"
              >
                <Minus size={14} strokeWidth={1.5} />
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                className="p-3 hover:text-gold transition-colors"
              >
                <Plus size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={handleAddToBag}
              className="flex-1 bg-ink text-ivory text-xs tracking-luxe uppercase py-4 hover:bg-charcoal transition-colors duration-300"
            >
              Add to Bag
            </button>
            <button
              aria-label="Add to wishlist"
              onClick={() => toggle(product.id)}
              className={`w-14 flex items-center justify-center border transition-colors ${
                wishlisted ? "border-ink text-gold" : "border-line hover:border-ink"
              }`}
            >
              <Heart size={17} strokeWidth={1.5} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex flex-col gap-2 text-xs text-stone mb-8">
            <div className="flex items-center gap-2">
              <Truck size={14} strokeWidth={1.5} />
              <span>Complimentary shipping on orders above ₹4,999</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={14} strokeWidth={1.5} />
              <span>Free returns within 14 days</span>
            </div>
          </div>

          <Accordion
            items={[
              {
                title: "Description",
                content: product.description,
              },
              {
                title: "Details & Care",
                content: (
                  <ul className="space-y-1.5">
                    {productDetails(product).map((d) => (
                      <li key={d}>— {d}</li>
                    ))}
                  </ul>
                ),
              },
              {
                title: "Shipping & Returns",
                content:
                  "Orders are dispatched within 2 business days. Free returns and exchanges within 14 days of delivery.",
              },
            ]}
          />
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-24">
          <h2 className="font-display text-2xl md:text-3xl mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
