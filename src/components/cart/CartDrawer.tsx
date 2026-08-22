"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import Placeholder from "../Placeholder";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-ink/40 z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-ivory z-[60] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-line shrink-0">
              <h2 className="font-display text-xl">
                Your Bag {items.length > 0 ? `(${items.length})` : ""}
              </h2>
              <button aria-label="Close bag" onClick={closeCart}>
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <p className="font-display text-2xl mb-2">Your bag is empty</p>
                <p className="text-sm text-stone mb-6">
                  Discover pieces made to be kept.
                </p>
                <button
                  onClick={closeCart}
                  className="text-xs tracking-luxe uppercase border-b border-ink pb-0.5"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      className="flex gap-4 py-6 border-b border-line"
                    >
                      <div className="relative h-28 w-22 shrink-0 overflow-hidden bg-ivory-dim">
                        <Placeholder seed={item.seed} className="h-full w-full" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm">{item.name}</h3>
                            <button
                              aria-label="Remove item"
                              onClick={() => removeItem(item.key)}
                              className="text-stone hover:text-ink transition-colors"
                            >
                              <X size={15} strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="text-xs text-stone mt-1">
                            {item.color} / {item.size}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center border border-line">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity - 1)
                              }
                              className="p-2 hover:text-gold transition-colors"
                            >
                              <Minus size={12} strokeWidth={1.5} />
                            </button>
                            <span className="w-6 text-center text-xs">
                              {item.quantity}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                              className="p-2 hover:text-gold transition-colors"
                            >
                              <Plus size={12} strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="text-sm">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line px-6 py-6 shrink-0">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-xs text-stone mb-5">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block text-center bg-ink text-ivory text-xs tracking-luxe uppercase py-4 hover:bg-charcoal transition-colors duration-300"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
