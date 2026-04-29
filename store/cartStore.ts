"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { CartItem, MenuItem } from "@/lib/db/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  version: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (menuItem: MenuItem) => void;
  decrementItem: (menuItemId: string) => void;
  incrementItem: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      version: 0,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (menuItem) =>
        set((state) => {
          const existing = state.items.find((item) => item.menuItem.id === menuItem.id);
          if (!existing) {
            return {
              items: [...state.items, { menuItem, quantity: 1 }],
              version: state.version + 1,
            };
          }

          return {
            items: state.items.map((item) =>
              item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item,
            ),
            version: state.version + 1,
          };
        }),
      decrementItem: (menuItemId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.menuItem.id === menuItemId ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
          version: state.version + 1,
        })),
      incrementItem: (menuItemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.menuItem.id === menuItemId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
          version: state.version + 1,
        })),
      removeItem: (menuItemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.menuItem.id !== menuItemId),
          version: state.version + 1,
        })),
      clearCart: () => set((state) => ({ items: [], version: state.version + 1 })),
    }),
    {
      name: "foodrush-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
