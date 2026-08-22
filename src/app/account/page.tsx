"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Heart, MapPin, LogOut } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import { getMyOrders } from "@/lib/orders";
import { getAddresses } from "@/lib/addresses";

export default function AccountPage() {
  const { user, ready, logout } = useAuth();
  const { ids: wishlistIds } = useWishlist();
  const router = useRouter();
  const [orderCount, setOrderCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/account/login?redirect=/account");
      return;
    }
    if (user) {
      getMyOrders().then((orders) => setOrderCount(orders.length));
      getAddresses().then((addresses) => setAddressCount(addresses.length));
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-32" />
        <Footer />
      </>
    );
  }

  const links = [
    {
      label: "Order History",
      icon: Package,
      href: "/account/orders",
      detail: orderCount === 0 ? "No orders yet" : `${orderCount} order${orderCount > 1 ? "s" : ""}`,
    },
    {
      label: "Wishlist",
      icon: Heart,
      href: "/wishlist",
      detail:
        wishlistIds.length === 0
          ? "No saved items"
          : `${wishlistIds.length} item${wishlistIds.length > 1 ? "s" : ""}`,
    },
    {
      label: "Addresses",
      icon: MapPin,
      href: "/account/addresses",
      detail: addressCount === 0 ? "No saved addresses" : `${addressCount} saved`,
    },
  ];

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="w-full mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <p className="text-xs tracking-luxe uppercase text-gold mb-3">
          My Account
        </p>
        <h1 className="font-display text-3xl md:text-4xl mb-2">
          Welcome, {user.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-stone mb-12">{user.email}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          {links.map(({ label, icon: Icon, href, detail }) => (
            <Link
              key={label}
              href={href}
              className="border border-line p-6 hover:border-ink transition-colors"
            >
              <Icon size={20} strokeWidth={1.5} className="mb-4" />
              <p className="text-sm">{label}</p>
              <p className="text-xs text-stone mt-1">{detail}</p>
            </Link>
          ))}
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs tracking-luxe uppercase mt-12 border-b border-ink pb-1"
        >
          <LogOut size={14} strokeWidth={1.5} />
          Sign Out
        </button>
      </main>
      <Footer />
    </>
  );
}
