"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[88vh] min-h-140 w-full overflow-hidden">
      <Image
        src="/marketing/hero.jpg"
        alt="Model in a camel wool coat and hat"
        fill
        priority
        className="object-cover object-[65%_20%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/20 to-ink/10" />

      <div className="relative z-10 h-full mx-auto max-w-7xl px-6 lg:px-10 flex flex-col justify-end pb-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-ivory text-xs tracking-luxe uppercase mb-4"
        >
          The Autumn Collection
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="font-display text-ivory text-5xl md:text-7xl leading-[1.05] max-w-2xl"
        >
          Quiet luxury, deliberately made.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="mt-8"
        >
          <Link
            href="/shop"
            className="inline-flex items-center border border-ivory/70 text-ivory text-xs tracking-luxe uppercase px-8 py-3.5 hover:bg-ivory hover:text-ink transition-colors duration-300"
          >
            Discover the Edit
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
