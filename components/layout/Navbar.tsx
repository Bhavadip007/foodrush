"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useCart } from "@/hooks/useCart";

export function Navbar() {
  const { count, toggleCart, version } = useCart();
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setShake(true);
    const timer = setTimeout(() => setShake(false), 380);
    return () => clearTimeout(timer);
  }, [version]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0C0A09]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl italic text-[#FF5C1A]">Food</span>
          <span className="text-xl font-bold text-[var(--text-primary)]">Rush</span>
        </Link>

        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            aria-label="Open cart"
            onClick={toggleCart}
            animate={shake ? { rotate: [0, -8, 8, -6, 0] } : { rotate: 0 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-full border border-[#FF5C1A]/30 bg-[#FF5C1A]/10 p-2 text-[#FFB347] transition hover:border-[#FF5C1A]/60"
          >
            <ShoppingBag size={18} />
            <AnimatePresence>
              {count > 0 ? (
                <motion.span
                  key={count}
                  initial={{ scale: 0.6, y: -2, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--accent-primary)] px-1 text-xs font-medium text-white shadow-[0_0_20px_rgba(255,92,26,0.45)]"
                >
                  <span className="font-mono">{count}</span>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
