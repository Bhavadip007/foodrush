"use client";

import { motion } from "framer-motion";

import { CategoryFilterValue, categoryOptions } from "@/lib/constants";

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="hide-scrollbar flex gap-3 overflow-x-auto px-2 pb-2">
      {categoryOptions.map((category) => {
        const isActive = category.value === value;
        return (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={`relative h-11 shrink-0 overflow-hidden rounded-full px-5 text-sm font-medium transition ${
              isActive
                ? "text-white shadow-[0_0_20px_rgba(255,92,26,0.4)]"
                : "glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {isActive ? (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--gradient-hero)" }}
                transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
              />
            ) : null}
            <span className="relative z-10">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
