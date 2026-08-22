"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-ivory">
      <aside className="w-64 shrink-0 border-r border-line px-6 py-8 hidden md:flex md:flex-col">
        <Link href="/admin" className="font-display text-xl tracking-[0.15em] uppercase">
          Veloura
        </Link>
        <p className="text-[10px] tracking-luxe uppercase text-stone mb-10 mt-1">
          Admin
        </p>

        <nav className="space-y-1 flex-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-ink text-ivory" : "text-charcoal hover:bg-ivory-dim"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={async () => {
            await logout();
            router.push("/admin/login");
          }}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-charcoal hover:bg-ivory-dim transition-colors"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign Out
        </button>
      </aside>

      <div className="flex-1 px-6 md:px-10 py-8 md:py-10 overflow-x-auto min-w-0">
        {children}
      </div>
    </div>
  );
}
