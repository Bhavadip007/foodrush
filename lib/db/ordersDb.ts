import fs from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { CartItem, DeliveryDetails, Order, OrderStatus } from "@/lib/db/types";

// Vercel serverless: only /tmp is writable; project dir is read-only (writes → 500).
const ORDERS_FILE =
  process.env.VERCEL === "1"
    ? path.join(os.tmpdir(), "foodrush-orders-store.json")
    : path.join(process.cwd(), "lib", "db", ".orders-store.json");
type OrdersStore = Record<string, Order>;
const IS_TEST = process.env.NODE_ENV === "test";
const testStore = new Map<string, Order>();

const calcTotal = (items: CartItem[]): number =>
  Number(
    items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0).toFixed(2),
  );

const readOrdersStore = (): OrdersStore => {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(ORDERS_FILE, "utf8");
    if (!raw.trim()) {
      return {};
    }
    return JSON.parse(raw) as OrdersStore;
  } catch {
    return {};
  }
};

const writeOrdersStore = (store: OrdersStore): void => {
  const dir = path.dirname(ORDERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(store, null, 2), "utf8");
};

export const getOrders = (): Order[] =>
  IS_TEST ? Array.from(testStore.values()) : Object.values(readOrdersStore());

export const getOrderById = (id: string): Order | null => {
  if (IS_TEST) {
    return testStore.get(id) ?? null;
  }
  const store = readOrdersStore();
  return store[id] ?? null;
};

export const createOrder = ({
  items,
  deliveryDetails,
}: {
  items: CartItem[];
  deliveryDetails: DeliveryDetails;
}): Order => {
  const now = new Date().toISOString();
  const id = uuidv4();

  const order: Order = {
    id,
    items,
    deliveryDetails,
    status: "Order Received",
    totalAmount: calcTotal(items),
    createdAt: now,
    updatedAt: now,
  };

  if (IS_TEST) {
    testStore.set(id, order);
  } else {
    const store = readOrdersStore();
    store[id] = order;
    writeOrdersStore(store);
  }
  return order;
};

export const updateOrderStatus = (id: string, status: OrderStatus): Order | null => {
  const existing = IS_TEST ? testStore.get(id) : readOrdersStore()[id];

  if (!existing) {
    return null;
  }

  const updated: Order = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  };

  if (IS_TEST) {
    testStore.set(id, updated);
  } else {
    const store = readOrdersStore();
    store[id] = updated;
    writeOrdersStore(store);
  }
  return updated;
};

export const clearOrdersForTests = (): void => {
  testStore.clear();
  if (!IS_TEST) {
    writeOrdersStore({});
  }
};
