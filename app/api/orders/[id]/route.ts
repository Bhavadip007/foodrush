import { NextResponse } from "next/server";

import { getOrderById, updateOrderStatus } from "@/lib/db/ordersDb";
import { orderStatusSchema } from "@/lib/validators/orderValidator";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const order = getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: order }, { status: 200 });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const payload = await request.json();
  const parsed = orderStatusSchema.safeParse(payload?.status);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid status value" }, { status: 400 });
  }

  const updated = updateOrderStatus(params.id, parsed.data);
  if (!updated) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated }, { status: 200 });
}
