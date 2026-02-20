import { create } from "zustand";
import type { Food } from "../types/food";

interface CartItem {
  food: Food;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (food: Food) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (food) =>
    set((state) => {
      const existing = state.items.find((i) => i.food.id === food.id);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.food.id === food.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return { items: [...state.items, { food, quantity: 1 }] };
    }),

  removeFromCart: (foodId) =>
    set((state) => ({
      items: state.items.filter((i) => i.food.id !== foodId),
    })),

  clearCart: () => set({ items: [] }),

  totalPrice: () =>
    get().items.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0
    ),
}));