"use client";

import Image from "next/image";

import { formatPrice } from "@/lib/format";
import type { CartItem as CartLine } from "@/lib/db/types";

interface CartItemProps {
  item: CartLine;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  const subtotal = Number((item.menuItem.price * item.quantity).toFixed(2));

  return (
    <div className="border-b border-white/10 py-4">
      <div className="flex gap-3">
        <div className="relative h-16 w-16 overflow-hidden rounded-xl">
          <Image src={item.menuItem.image} alt={item.menuItem.name} fill className="object-cover" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">{item.menuItem.name}</p>
            <button
              type="button"
              aria-label={`Remove ${item.menuItem.name}`}
              onClick={onRemove}
              className="text-[var(--text-secondary)] transition hover:text-red-400"
            >
              Remove
            </button>
          </div>
          <p className="font-mono text-xs text-[var(--text-secondary)]">
            {formatPrice(item.menuItem.price)} each
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-full border border-[#FF5C1A]/30 p-1">
              <button type="button" className="h-7 w-7 rounded-full hover:bg-[#FF5C1A]/20" onClick={onDecrease}>
                -
              </button>
              <span className="w-7 text-center font-mono text-sm">{item.quantity}</span>
              <button type="button" className="h-7 w-7 rounded-full hover:bg-[#FF5C1A]/20" onClick={onIncrease}>
                +
              </button>
            </div>
            <p className="font-mono text-sm font-semibold text-[#FFB347]">{formatPrice(subtotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
