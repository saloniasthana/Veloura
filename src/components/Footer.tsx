import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/shop?filter=new" },
      { label: "Womenswear", href: "/shop?category=Women" },
      { label: "Menswear", href: "/shop?category=Men" },
      { label: "Accessories", href: "/shop?category=Accessories" },
      { label: "Sale", href: "/shop?filter=sale" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track Order", href: "/account/orders" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/our-story" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Craftsmanship", href: "/craftsmanship" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ivory-dim border-t border-line mt-auto">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-2xl tracking-[0.15em] uppercase">
            Veloura
          </span>
          <p className="text-xs text-stone mt-4 leading-relaxed max-w-55">
            Considered fashion for a considered life.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs tracking-luxe uppercase mb-4">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone">
          <span>© {new Date().getFullYear()} Veloura. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
