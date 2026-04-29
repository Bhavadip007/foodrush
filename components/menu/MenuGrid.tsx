"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { MenuCard } from "@/components/menu/MenuCard";
import { CategoryFilterValue } from "@/lib/constants";
import { MenuItem } from "@/lib/db/types";
import { useCart } from "@/hooks/useCart";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

interface MenuGridProps {
  items: MenuItem[];
  category: CategoryFilterValue;
}

export function MenuGrid({ items, category }: MenuGridProps) {
  const { items: cartItems, addItem, incrementItem, decrementItem } = useCart();

  const filtered = useMemo(
    () => (category === "All" ? items : items.filter((item) => item.category === category)),
    [items, category],
  );

  const quantityById = useMemo(
    () => new Map(cartItems.map((line) => [line.menuItem.id, line.quantity])),
    [cartItems],
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {filtered.map((item) => (
        <motion.div key={item.id} variants={cardVariants}>
          <MenuCard
            item={item}
            quantity={quantityById.get(item.id) ?? 0}
            onAdd={() => addItem(item)}
            onIncrement={() => incrementItem(item.id)}
            onDecrement={() => decrementItem(item.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
