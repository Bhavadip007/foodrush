"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { formatPrice } from "@/lib/format";
import { MenuItem } from "@/lib/db/types";

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function MenuCard({ item, quantity, onAdd, onIncrement, onDecrement }: MenuCardProps) {
  const [showFly, setShowFly] = useState(false);

  const triggerAdd = () => {
    onAdd();
    setShowFly(true);
    setTimeout(() => setShowFly(false), 800);
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="menu-card glass-card group relative cursor-pointer overflow-hidden border border-white/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {item.category}
        </div>
        {item.isPopular ? (
          <div className="absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-[0_0_22px_rgba(255,92,26,0.35)]">
            <span className="inline-flex items-center gap-1 rounded-full bg-[image:var(--gradient-hero)] px-2 py-1">Popular</span>
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-card)]/95 to-transparent" />
      </div>

      <div className="space-y-4 p-4">
        <h3 className="truncate font-display text-xl font-semibold text-[var(--text-primary)]">{item.name}</h3>
        <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">{item.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-amber-300">Rating {item.rating.toFixed(1)}</span>
          <span className="text-[var(--text-secondary)]">Prep {item.prepTime}m</span>
          <span className="text-[var(--text-secondary)]">{item.calories ?? "--"} cal</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-mono text-2xl font-bold gradient-text">{formatPrice(item.price)}</p>
          {quantity > 0 ? (
            <div className="flex items-center gap-1 rounded-full border border-[#FF5C1A]/35 bg-black/25 p-1">
              <button
                type="button"
                onClick={onDecrement}
                className="h-8 w-8 rounded-full text-sm text-[var(--text-primary)] transition hover:bg-[#FF5C1A]/20"
              >
                -
              </button>
              <span className="w-8 text-center font-mono text-sm text-white">{quantity}</span>
              <button
                type="button"
                onClick={onIncrement}
                className="h-8 w-8 rounded-full text-sm text-[var(--text-primary)] transition hover:bg-[#FF5C1A]/20"
              >
                +
              </button>
            </div>
          ) : (
            <motion.button
              type="button"
              aria-label={`Add ${item.name}`}
              onClick={triggerAdd}
              whileTap={{ scale: [0.8, 1.2, 1] }}
              className="btn-primary relative h-9 w-9 rounded-full text-lg text-white"
            >
              +
              <AnimatePresence>
                {showFly ? (
                  <motion.span
                    initial={{ opacity: 0, y: 0, x: 0, scale: 0.8 }}
                    animate={{ opacity: [1, 1, 0], y: -54, x: 45, scale: 1.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="pointer-events-none absolute -top-1 left-1"
                  />
                ) : null}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
