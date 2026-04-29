export const categoryOptions = [
  { label: "All", value: "All", icon: "utensils" },
  { label: "Pizza", value: "Pizza", icon: "pizza" },
  { label: "Burgers", value: "Burgers", icon: "sandwich" },
  { label: "Sushi", value: "Sushi", icon: "fish" },
  { label: "Desserts", value: "Desserts", icon: "iceCream" },
  { label: "Drinks", value: "Drinks", icon: "cupSoda" },
] as const;

export type CategoryFilterValue = (typeof categoryOptions)[number]["value"];
