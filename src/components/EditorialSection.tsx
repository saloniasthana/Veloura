"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function EditorialSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative h-125 overflow-hidden"
      >
        <Image
          src="/marketing/craft.jpg"
          alt="Hand-finishing a garment, needle and thread"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <span className="absolute bottom-3 left-3 font-display text-xs tracking-luxe uppercase text-ivory/90">
          Craft, since 2019
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      >
        <p className="text-xs tracking-luxe uppercase text-gold mb-4">
          Our Philosophy
        </p>
        <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6">
          Fewer pieces.
          <br />
          Made to be kept.
        </h2>
        <p className="text-charcoal leading-relaxed max-w-md mb-8">
          Every Veloura piece is designed in small batches, cut from
          responsibly sourced fabric, and finished by hand. We believe in
          slow fashion — garments that earn a place in your wardrobe for
          years, not seasons.
        </p>
        <a
          href="#"
          className="text-xs tracking-luxe uppercase border-b border-ink pb-1"
        >
          Read Our Story
        </a>
      </motion.div>
    </section>
  );
}
