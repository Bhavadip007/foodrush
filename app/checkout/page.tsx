"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { CheckoutForm, CheckoutFormValues } from "@/components/checkout/CheckoutForm";
import { PageTransition } from "@/components/layout/PageTransition";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { Order } from "@/lib/db/types";
import { useOrderStore } from "@/store/orderStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, total, clearCart } = useCart();
  const { setOrder } = useOrderStore();
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: CheckoutFormValues) => {
    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          deliveryDetails: {
            name: values.name,
            phone: values.phone,
            address: values.address,
          },
        }),
      });

      const payload = (await response.json()) as { success: boolean; data?: Order; error?: string };
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error ?? "Unable to place order.");
      }

      setOrder(payload.data);
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order/${payload.data.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        <aside className="glass-card h-fit space-y-4 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-3xl">Order Summary</h2>
          <div className="space-y-3">
            {items.map((line) => (
              <div key={line.menuItem.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                  <Image src={line.menuItem.image} alt={line.menuItem.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{line.menuItem.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {line.quantity} × {formatPrice(line.menuItem.price)}
                  </p>
                </div>
                <p className="font-mono text-sm">{formatPrice(line.menuItem.price * line.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-white/10 pt-3 text-sm">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Delivery</span>
              <span className="font-mono text-[var(--success)]">FREE</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="font-display text-2xl">Total</span>
              <span className="font-display text-2xl text-[#FFB347]">{formatPrice(total)}</span>
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)]">Estimated delivery: ~25-30 minutes</p>
        </aside>
      </div>
    </PageTransition>
  );
}
