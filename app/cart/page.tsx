"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { PageTransition } from "@/components/layout/PageTransition";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, incrementItem, decrementItem, removeItem, subtotal, total } = useCart();

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="font-display text-5xl">Cart</h1>
        {items.length === 0 ? (
          <div className="glass-card space-y-4 p-8 text-center">
            <div className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 p-5 text-[#FF8C42]">
              <ShoppingCart size={40} />
            </div>
            <p className="font-display text-3xl">Your cart is empty</p>
            <Link href="/" className="btn-primary inline-block rounded-full px-5 py-2 text-white">
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="glass-card p-4">
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
            <div className="glass-card space-y-3 p-6">
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3">
                <span className="font-display text-2xl">Total</span>
                <span className="font-display text-2xl text-[#FFB347]">{formatPrice(total)}</span>
              </div>
              <Link href="/checkout" className="btn-primary block rounded-xl px-5 py-3 text-center font-semibold text-white">
                Proceed to Checkout →
              </Link>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
