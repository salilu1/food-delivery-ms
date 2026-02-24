import { create } from "zustand";

interface Food {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface CartItem {
  id: string;
  foodId: string;
  quantity: number;
  food: Food; // required (we guarantee it exists)
}

interface CartState {
  items: CartItem[];

  fetchCart: (token: string) => Promise<void>;
  addToCart: (foodId: string, token: string) => Promise<void>;
  decrementFromCart: (foodId: string, token: string) => Promise<void>;
  removeCart: (foodId: string, token: string) => Promise<void>;

  totalPrice: () => number;
  cartCount: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // ✅ Fetch cart and enrich with catalog data
  fetchCart: async (token) => {
  if (!token) return;

  try {
    const res = await fetch("http://172.24.111.254:5003/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch cart");

    const cart = await res.json();

    // Fetch all foods
    const foodsRes = await fetch("http://172.24.111.254:4002/catalog");
    const foods: Food[] = await foodsRes.json();

    // Merge food data safely
    const enrichedItems = (cart?.items || []).map((item: any) => ({
      ...item,
      food: foods.find((f) => f.id === item.foodId) || {
        id: item.foodId,
        name: "Unknown",
        price: 0,
      },
    }));

    set({ items: enrichedItems });
  } catch (err) {
    console.error("Fetch cart error:", err);
  }
},

  // ✅ Add
  addToCart: async (foodId, token) => {
    if (!token) return;

    await fetch("http://172.24.111.254:5003/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ foodId }),
    });

    await get().fetchCart(token);
  },

  // ✅ Decrement
  decrementFromCart: async (foodId, token) => {
    if (!token) return;

    await fetch("http://172.24.111.254:5003/cart/decrement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ foodId }),
    });

    await get().fetchCart(token);
  },

  // ✅ Remove completely
  removeCart: async (foodId, token) => {
    if (!token) return;

    await fetch(`http://172.24.111.254:5003/cart/${foodId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await get().fetchCart(token);
  },

  // ✅ Total price (safe now)
  totalPrice: () =>
    get().items.reduce(
      (total, item) => total + item.food.price * item.quantity,
      0
    ),

  // ✅ Cart badge count
  cartCount: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  clearCart: () => set({ items: [] }),
}));