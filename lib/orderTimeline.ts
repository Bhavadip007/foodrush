import { OrderStatus } from "@/lib/db/types";

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

export const ORDER_DEMO_TOTAL_MS = 40_000;
export const ORDER_TRANSITION_MS = Math.floor(ORDER_DEMO_TOTAL_MS / (ORDER_STATUS_STEPS.length - 1));
