"use client";

import confetti from "canvas-confetti";
import { Check, PartyPopper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";

import { StatusBadge } from "@/components/order/StatusBadge";
import { formatPrice } from "@/lib/format";
import { Order } from "@/lib/db/types";
import { ORDER_STATUS_STEPS, ORDER_TRANSITION_MS } from "@/lib/orderTimeline";

const labelTime = (iso: string, fallback = "Pending"): string => {
  if (!iso) return fallback;
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const stepTimeLabel = (createdAt: string, stepIndex: number): string => {
  const baseMs = new Date(createdAt).getTime();
  const stepMs = baseMs + stepIndex * ORDER_TRANSITION_MS;
  return labelTime(new Date(stepMs).toISOString());
};

export function OrderStatusTracker({ order }: { order: Order }) {
  const activeIndex = ORDER_STATUS_STEPS.indexOf(order.status);

  const estimated = useMemo(() => {
    const transitionsLeft = Math.max(0, ORDER_STATUS_STEPS.length - 1 - activeIndex);
    const secondsLeft = Math.ceil((transitionsLeft * ORDER_TRANSITION_MS) / 1000);
    return `${secondsLeft}s`;
  }, [activeIndex]);

  useEffect(() => {
    if (order.status === "Delivered") {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.55 },
        colors: ["#FF5C1A", "#FFB347", "#FFD89A"],
      });
    }
  }, [order.status]);

  return (
    <div className="space-y-8">
      <div className="space-y-4 text-center">
        <p className="font-mono text-sm text-[var(--text-secondary)]">Order #FR{order.id.slice(0, 4).toUpperCase()}</p>
        <StatusBadge status={order.status} />
        <p className="text-sm text-[var(--text-secondary)]">Estimated delivery: {estimated}</p>
      </div>

      <div className="glass-card px-6 py-8">
        <ol className="grid gap-8 md:grid-cols-4 md:gap-4">
          {ORDER_STATUS_STEPS.map((step, index) => {
            const completed = index < activeIndex;
            const active = index === activeIndex;

            return (
              <li key={step} className="relative flex flex-col items-center gap-3">
                {index < ORDER_STATUS_STEPS.length - 1 ? (
                  <span
                    className={`absolute left-1/2 top-6 hidden h-1 w-full md:block ${
                      completed ? "bg-[image:var(--gradient-hero)]" : "bg-white/10"
                    }`}
                  />
                ) : null}
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border ${
                    completed || active
                      ? "border-transparent bg-[image:var(--gradient-hero)] text-white shadow-[0_0_28px_rgba(255,92,26,0.45)]"
                      : "border-white/20 bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                  }`}
                >
                  {completed ? <Check size={20} /> : index + 1}
                  {active ? <span className="absolute inset-0 animate-ripple rounded-full border border-[#FF5C1A]" /> : null}
                </div>
                <p className="text-center text-sm font-medium">{step}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {index <= activeIndex ? stepTimeLabel(order.createdAt, index) : "Pending"}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="glass-card space-y-4 p-6">
        <h3 className="font-display text-2xl">Order Details</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.menuItem.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                <Image src={item.menuItem.image} alt={item.menuItem.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{item.menuItem.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">x{item.quantity}</p>
              </div>
              <p className="font-mono text-sm">{formatPrice(item.menuItem.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-3 text-sm text-[var(--text-secondary)]">
          <p>Delivery: {order.deliveryDetails.address}</p>
          <p className="mt-1 text-[var(--text-primary)]">Payment: Cash on Delivery</p>
          <p className="mt-1 font-mono text-[#FFB347]">Total: {formatPrice(order.totalAmount)}</p>
        </div>
      </div>

      {order.status === "Delivered" ? (
        <div className="glass-card space-y-4 p-8 text-center">
          <div className="mx-auto w-fit rounded-full border border-[#FF8C42]/40 bg-[#FF5C1A]/10 p-4 text-[#FFB347]">
            <PartyPopper size={38} />
          </div>
          <h2 className="font-display text-4xl">Enjoy your meal, {order.deliveryDetails.name}!</h2>
          <p className="text-[var(--text-secondary)]">Rate your experience</p>
          <div className="flex justify-center gap-1 text-2xl text-amber-300">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>☆</span>
          </div>
          <Link href="/" className="btn-primary inline-block rounded-full px-6 py-3 font-semibold text-white">
            Order Again
          </Link>
        </div>
      ) : null}
    </div>
  );
}
