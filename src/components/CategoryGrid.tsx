"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const MotionLink = motion.create(Link);

const CATEGORIES = [
  {
    name: "Womenswear",
    image: "/marketing/womenswear.jpg",
    position: "object-[50%_20%]",
    href: "/shop?category=Women",
  },
  {
    name: "Menswear",
    image: "/marketing/menswear.jpg",
    position: "object-[35%_center]",
    href: "/shop?category=Men",
  },
  {
    name: "Accessories",
    image: "/marketing/accessories.jpg",
    position: "object-center",
    href: "/shop?category=Accessories",
  },
];

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, i) => (
          <MotionLink
            href={cat.href}
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            className="group relative block h-105 overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className={`object-cover ${cat.position} transition-transform duration-700 ease-out group-hover:scale-105`}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <span className="font-display text-ivory text-2xl">
                {cat.name}
              </span>
              <span className="text-ivory text-xs tracking-luxe uppercase border-b border-ivory/60 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Shop
              </span>
            </div>
          </MotionLink>
        ))}
      </div>
    </section>
  );
}
