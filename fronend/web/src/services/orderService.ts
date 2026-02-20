// src/services/orderService.ts
export type OrderItem = {
  id: string;
  orderId: string;
  foodId: string;
  foodName: string;   // <--- make sure this exists
  unitPrice: number;
  quantity: number;
};

export type OrderCustomer = {
  id: string;
  name: string;
  email: string;
};

export type Order = {
  id: string;
  customerId: string;
  customer: OrderCustomer;
  items: OrderItem[];
  totalPrice: number; // <--- make sure this exists
  status: string;
  createdAt: string;
  updatedAt: string;
};

// Fetch all orders (admin)
export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("http://172.24.111.254:4003/orders", {
    credentials: "include",
  });
  return res.json();
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`http://172.24.111.254:4003/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
  return res.json();
}
export async function createOrder(data: {
  items: { foodId: string; quantity: number }[];
}) {
  const res = await fetch("http://172.24.111.254:4003/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}
// Fetch logged-in customer's orders
export async function getMyOrders(): Promise<Order[]> {
  const res = await fetch("http://172.24.111.254:4003/orders/me", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}