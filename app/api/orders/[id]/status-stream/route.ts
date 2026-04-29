import { getOrderById, updateOrderStatus } from "@/lib/db/ordersDb";
import { OrderStatus } from "@/lib/db/types";
import { ORDER_STATUS_STEPS, ORDER_TRANSITION_MS } from "@/lib/orderTimeline";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const order = getOrderById(params.id);
  if (!order) {
    return new Response(JSON.stringify({ success: false, error: "Order not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  let intervalId: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let index = ORDER_STATUS_STEPS.indexOf(order.status);
      let closed = false;

      const cleanup = () => {
        if (intervalId !== undefined) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
      };

      const send = (status: OrderStatus) => {
        if (closed) return;
        const updated = updateOrderStatus(params.id, status);
        if (!updated) {
          return;
        }

        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ status, updatedAt: updated.updatedAt })}\n\n`),
          );
        } catch {
          closed = true;
          cleanup();
        }
      };

      send(ORDER_STATUS_STEPS[index]);

      intervalId = setInterval(() => {
        if (closed) return;
        index += 1;
        if (index >= ORDER_STATUS_STEPS.length) {
          closed = true;
          cleanup();
          try {
            controller.close();
          } catch {}
          return;
        }
        send(ORDER_STATUS_STEPS[index]);
      }, ORDER_TRANSITION_MS);
    },
    cancel() {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
