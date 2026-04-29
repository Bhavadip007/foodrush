"use client";

import { create } from "zustand";

import { Order, OrderStatus } from "@/lib/db/types";

interface OrderState {
  orders: Record<string, Order>;
  setOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus, updatedAt: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: {},
  setOrder: (order) =>
    set((state) => ({
      orders: {
        ...state.orders,
        [order.id]: order,
      },
    })),
  updateOrderStatus: (id, status, updatedAt) =>
    set((state) => {
      const existing = state.orders[id];
      if (!existing) {
        return state;
      }

      return {
        orders: {
          ...state.orders,
          [id]: { ...existing, status, updatedAt },
        },
      };
    }),
}));
