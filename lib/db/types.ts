export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "Pizza" | "Burgers" | "Sushi" | "Desserts" | "Drinks";
  rating: number;
  prepTime: number;
  isPopular?: boolean;
  calories?: number;
}

export type OrderStatus =
  | "Order Received"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered";

export interface DeliveryDetails {
  name: string;
  address: string;
  phone: string;
  notes?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  deliveryDetails: DeliveryDetails;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
