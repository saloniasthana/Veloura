"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Women", href: "/shop?category=Women" },
  { label: "Men", href: "/shop?category=Men" },
  { label: "Accessories", href: "/shop?category=Accessories" },
  { label: "The Edit", href: "/shop" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { count, openCart } = useCart();
  const { ids: wishlistIds } = useWishlist();

  return (
    <header className="sticky top-0 z-50 bg-ivory/90 backdrop-blur-md border-b border-line">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <button
            className="lg:hidden p-1"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs tracking-luxe uppercase text-charcoal hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          href="/"
          className="font-display text-2xl md:text-3xl tracking-[0.2em] uppercase text-center flex-1"
        >
          Veloura
        </Link>

        <div className="flex items-center justify-end gap-5 flex-1">
          <button aria-label="Search" className="hover:text-gold transition-colors">
            <Search size={19} strokeWidth={1.5} />
          </button>
          <Link
            href={user ? "/account" : "/account/login"}
            aria-label="Account"
            className="hidden sm:inline-flex hover:text-gold transition-colors"
          >
            <User size={19} strokeWidth={1.5} />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hover:text-gold transition-colors"
          >
            <Heart size={19} strokeWidth={1.5} />
            {wishlistIds.length > 0 ? (
              <span className="absolute -top-2 -right-2 text-[10px] bg-gold text-ivory rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistIds.length}
              </span>
            ) : null}
          </Link>
          <button
            aria-label="Bag"
            onClick={openCart}
            className="relative hover:text-gold transition-colors"
          >
            <ShoppingBag size={19} strokeWidth={1.5} />
            {count > 0 ? (
              <span className="absolute -top-2 -right-2 text-[10px] bg-gold text-ivory rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="lg:hidden flex flex-col gap-1 px-6 pb-5 border-t border-line">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-sm tracking-wide uppercase text-charcoal hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
