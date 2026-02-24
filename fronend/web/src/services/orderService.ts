// src/services/orderService.ts
export type OrderItem = {
  id: string;
  orderId: string;
  foodId: string;
  foodName: string;
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
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

// Fetch all orders (admin)
export async function fetchOrders(token: string): Promise<Order[]> {
  const res = await fetch("http://172.24.111.254:4003/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string, token: string) {
  const res = await fetch(`http://172.24.111.254:4003/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Create new order
export async function createOrder(
  data: { items: { foodId: string; quantity: number }[] },
  token: string
) {
  const res = await fetch("http://172.24.111.254:4003/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Fetch logged-in customer's orders
export async function getMyOrders(token: string): Promise<Order[]> {
  const res = await fetch("http://172.24.111.254:4003/orders/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}