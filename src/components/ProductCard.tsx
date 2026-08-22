"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ProductImage from "./ProductImage";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

function stopNav(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}

export default function ProductCard({
  product,
  variant = "grid",
}: {
  product: Product;
  variant?: "grid" | "list";
}) {
  const href = `/product/${product.id}`;
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const wishlisted = has(product.id);

  function handleWishlist(e: React.MouseEvent) {
    stopNav(e);
    toggle(product.id);
  }

  function handleQuickAdd(e: React.MouseEvent) {
    stopNav(e);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      compareAt: product.compareAt ?? undefined,
      seed: product.seed,
      size: product.sizes[0],
      color: product.colors[0].name,
    });
  }

  if (variant === "list") {
    return (
      <Link
        href={href}
        className="group flex gap-6 py-6 border-b border-line"
      >
        <div className="relative h-40 w-32 shrink-0 overflow-hidden bg-ivory-dim">
          <ProductImage
            src={product.images[0]}
            seed={product.seed}
            alt={product.name}
            className="h-full w-full"
          />
          {product.isNew ? (
            <span className="absolute top-2 left-2 bg-ivory text-[10px] tracking-luxe uppercase px-2 py-1">
              New
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <p className="text-[11px] tracking-luxe uppercase text-stone mb-1">
              {product.category}
            </p>
            <h3 className="font-display text-lg">{product.name}</h3>
            <p className="text-xs text-stone mt-2">
              {product.colors.map((c) => c.name).join(" / ")}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">
              {product.compareAt ? (
                <>
                  <span className="line-through text-stone mr-2">
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
            <button
              aria-label="Add to wishlist"
              onClick={handleWishlist}
              className={wishlisted ? "text-gold" : "hover:text-gold transition-colors"}
            >
              <Heart size={16} strokeWidth={1.5} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <div className="relative h-85 overflow-hidden bg-ivory-dim">
        <ProductImage
          src={product.images[0]}
          seed={product.seed}
          alt={product.name}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.isNew ? (
          <span className="absolute top-3 left-3 bg-ivory text-[10px] tracking-luxe uppercase px-2 py-1">
            New
          </span>
        ) : null}
        <button
          aria-label="Add to wishlist"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-ivory/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            wishlisted ? "text-gold opacity-100" : "hover:text-gold"
          }`}
        >
          <Heart size={15} strokeWidth={1.5} fill={wishlisted ? "currentColor" : "none"} />
        </button>
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-ink text-ivory text-xs tracking-luxe uppercase py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          Quick Add
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm text-ink">{product.name}</h3>
          <p className="text-xs text-stone mt-1">
            {product.compareAt ? (
              <>
                <span className="line-through mr-2">
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
        </div>
      </div>
    </Link>
  );
}
