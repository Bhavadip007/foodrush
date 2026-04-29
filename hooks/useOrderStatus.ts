"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import type { OrderStatus } from "@/lib/db/types";
import { useOrderStore } from "@/store/orderStore";

type StatusEvent = { status: OrderStatus; updatedAt: string };

export const useOrderStatus = (orderId: string, enabled: boolean) => {
  const { orders, updateOrderStatus } = useOrderStore();

  useEffect(() => {
    if (!orderId || !enabled) {
      return undefined;
    }

    const source = new EventSource(`/api/orders/${orderId}/status-stream`);
    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as StatusEvent;
        updateOrderStatus(orderId, payload.status, payload.updatedAt);
        toast.message(`Order update: ${payload.status}`);
        if (payload.status === "Delivered") {
          source.close();
        }
      } catch {
        toast.error("Could not read status update.");
      }
    };

    source.onerror = () => {
      source.close();
    };

    return () => {
      source.close();
    };
  }, [orderId, enabled, updateOrderStatus]);

  return orders[orderId];
};
