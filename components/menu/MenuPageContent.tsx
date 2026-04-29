"use client";

import { useEffect, useState } from "react";

import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { PageTransition } from "@/components/layout/PageTransition";
import { CategoryFilterValue } from "@/lib/constants";
import { MenuItem } from "@/lib/db/types";

interface MenuApiResponse {
  success: boolean;
  data: MenuItem[];
}

export function MenuPageContent() {
  const [category, setCategory] = useState<CategoryFilterValue>("All");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const query = category === "All" ? "" : `?category=${encodeURIComponent(category)}`;

    const loadMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/menu${query}`);
        const payload = (await response.json()) as MenuApiResponse;

        if (!response.ok || !payload.success) {
          throw new Error("Failed to load menu items.");
        }

        if (isActive) {
          setItems(payload.data);
        }
      } catch {
        if (isActive) {
          setError("Could not load menu right now. Please refresh.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadMenu();
    return () => {
      isActive = false;
    };
  }, [category]);

  return (
    <PageTransition>
      <section className="relative mb-8 overflow-hidden rounded-[28px] px-6 py-10 text-center sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,92,26,0.24)_0%,rgba(12,10,9,1)_70%)]" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF5C1A]/40 bg-[var(--bg-glass)] px-4 py-2 text-xs text-[#FFB347] backdrop-blur-xl">
            Free delivery on first order
          </div>
          <h1 className="text-4xl leading-tight md:text-7xl">
            Cravings,
            <br />
            <span className="gradient-text">Delivered.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--text-secondary)] md:text-base">
            Fresh meals from the best local kitchens
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2">25 min avg delivery</span>
            <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2">4.8 rated</span>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <CategoryFilter value={category} onChange={setCategory} />
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="glass-card h-[360px] animate-pulse border border-white/10 bg-white/5" />
            ))}
          </div>
        ) : null}
        {!loading && error ? (
          <div className="glass-card border border-red-500/30 p-6 text-center text-sm text-red-300">{error}</div>
        ) : null}
        {!loading && !error ? <MenuGrid items={items} category={category} /> : null}
      </section>
    </PageTransition>
  );
}
