"use client";

import { OrderStatus } from "@/lib/db/types";

const statusStyles: Record<OrderStatus, string> = {
  "Order Received": "bg-white/10 text-white",
  Preparing: "bg-amber-500/20 text-amber-300",
  "Out for Delivery": "bg-orange-500/20 text-orange-300",
  Delivered: "bg-emerald-500/20 text-emerald-300",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${statusStyles[status]}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
      </span>
      {status}
    </div>
  );
}
