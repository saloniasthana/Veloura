"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-ink text-ivory py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-xl px-6 text-center"
      >
        <p className="text-xs tracking-luxe uppercase text-gold-soft mb-3">
          Stay Close
        </p>
        <h2 className="font-display text-3xl mb-4">Join the Inner Circle</h2>
        <p className="text-ivory-dim/80 text-sm mb-8">
          Early access to drops, styling notes, and members-only pricing.
        </p>

        {submitted ? (
          <p className="text-gold-soft text-sm">
            Welcome to Veloura. Check your inbox to confirm.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSubmitted(true);
            }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-transparent border border-ivory/30 px-5 py-3 text-sm placeholder:text-ivory/50 flex-1 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="bg-ivory text-ink text-xs tracking-luxe uppercase px-8 py-3 hover:bg-gold hover:text-ivory transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
