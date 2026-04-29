"use client";

import Link from "next/link";

import { formatPrice } from "@/lib/format";

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  freeDelivery: boolean;
  onClose: () => void;
}

export function CartSummary({ subtotal, deliveryFee, total, freeDelivery, onClose }: CartSummaryProps) {
  return (
    <div className="space-y-4 border-t border-white/10 bg-[#1A1612]/95 p-4">
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span>Subtotal</span>
          <span className="font-mono">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span>Delivery fee</span>
          {freeDelivery ? (
            <span className="font-mono">
              <span className="mr-2 line-through opacity-60">$2.99</span>
              <span className="text-[var(--success)]">FREE</span>
            </span>
          ) : (
            <span className="font-mono">{formatPrice(deliveryFee)}</span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <span className="font-display text-2xl font-bold">Total</span>
        <span className="font-display text-2xl font-bold text-[#FFB347]">{formatPrice(total)}</span>
      </div>
      <Link
        href="/checkout"
        onClick={onClose}
        className="btn-primary block w-full rounded-xl px-4 py-3 text-center font-semibold text-white"
      >
        Proceed to Checkout →
      </Link>
      <button type="button" onClick={onClose} className="block w-full text-center text-sm text-[var(--text-secondary)]">
        Continue Shopping
      </button>
    </div>
  );
}
