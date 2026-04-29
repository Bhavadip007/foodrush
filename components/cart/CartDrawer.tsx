"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/hooks/useCart";

export function CartDrawer() {
  const {
    isOpen,
    items,
    closeCart,
    incrementItem,
    decrementItem,
    removeItem,
    subtotal,
    deliveryFee,
    total,
    count,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            aria-label="Close cart"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-[420px] flex-col border-l border-white/10 bg-[#1A1612]"
          >
            <header className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="font-display text-3xl">Your Order</h2>
                <p className="text-sm text-[var(--text-secondary)]">{count} items</p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full border border-white/10 p-2 hover:border-white/20"
              >
                <X size={16} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="rounded-full border border-white/10 bg-white/5 p-5 text-[#FF8C42]">
                  <ShoppingCart size={44} />
                </div>
                <h3 className="font-display text-3xl">Your cart is empty</h3>
                <p className="text-sm text-[var(--text-secondary)]">Add some delicious items</p>
                <button type="button" onClick={closeCart} className="btn-primary rounded-full px-5 py-2 text-white">
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="hide-scrollbar flex-1 overflow-y-auto px-4">
                  {items.map((line) => (
                    <CartItem
                      key={line.menuItem.id}
                      item={line}
                      onIncrease={() => incrementItem(line.menuItem.id)}
                      onDecrease={() => decrementItem(line.menuItem.id)}
                      onRemove={() => removeItem(line.menuItem.id)}
                    />
                  ))}
                </div>
                <CartSummary
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  total={total}
                  freeDelivery={deliveryFee === 0}
                  onClose={closeCart}
                />
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
