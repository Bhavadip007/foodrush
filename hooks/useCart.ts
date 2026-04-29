"use client";

import { useMemo } from "react";

import { useCartStore } from "@/store/cartStore";

export const useCart = () => {
  const store = useCartStore();

  const metrics = useMemo(() => {
    const count = store.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = Number(
      store.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0).toFixed(2),
    );
    const deliveryFee = 0;
    const total = Number((subtotal + deliveryFee).toFixed(2));

    return { count, subtotal, deliveryFee, total };
  }, [store.items]);

  return {
    ...store,
    ...metrics,
  };
};
