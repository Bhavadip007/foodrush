"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { OrderStatusTracker } from "@/components/order/OrderStatusTracker";
import { PageTransition } from "@/components/layout/PageTransition";
import { useOrderStatus } from "@/hooks/useOrderStatus";
import { Order } from "@/lib/db/types";
import { useOrderStore } from "@/store/orderStore";

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const { setOrder } = useOrderStore();
  const [serverOrder, setServerOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadDone, setLoadDone] = useState(false);
  const orderFromStore = useOrderStatus(orderId, loadDone && Boolean(serverOrder));

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setLoadDone(true);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setLoadDone(false);
        const response = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
        if (!response.ok) {
          setServerOrder(null);
          setLoading(false);
          setLoadDone(true);
          return;
        }

        const payload = (await response.json()) as { success: boolean; data?: Order };
        if (payload.success && payload.data) {
          setServerOrder(payload.data);
          setOrder(payload.data);
        } else {
          setServerOrder(null);
        }
      } catch {
        setServerOrder(null);
      } finally {
        setLoading(false);
        setLoadDone(true);
      }
    };

    void load();
  }, [orderId, setOrder]);

  const order = orderFromStore ?? serverOrder;

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl space-y-6">
        {loading ? (
          <div className="glass-card p-8 text-center text-[var(--text-secondary)]">Loading order details...</div>
        ) : null}
        {!loading && !order ? (
          <div className="glass-card p-8 text-center text-[var(--text-secondary)]">Order not found.</div>
        ) : null}
        {order ? <OrderStatusTracker order={order} /> : null}
      </div>
    </PageTransition>
  );
}
