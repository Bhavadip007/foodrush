import { z } from "zod";

const phoneRegex = /^\+?[0-9]{10,15}$/;

export const checkoutFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  address: z.string().min(10, "Address must be at least 10 characters."),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number."),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const orderStatusSchema = z.enum([
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
]);

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        menuItem: z.object({
          id: z.string().min(1),
          name: z.string().min(1),
          description: z.string().min(1),
          price: z.number().positive(),
          image: z.string().url(),
          category: z.enum(["Pizza", "Burgers", "Sushi", "Desserts", "Drinks"]),
          rating: z.number().min(0).max(5),
          prepTime: z.number().int().positive(),
          isPopular: z.boolean().optional(),
          calories: z.number().optional(),
        }),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "Order must contain at least one item."),
  deliveryDetails: z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    address: z.string().min(10, "Address must be at least 10 characters."),
    phone: z.string().regex(phoneRegex, "Enter a valid phone number."),
    notes: z.string().optional(),
  }),
});
