import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus, type Order } from "../../services/orderService";
import { io, type Socket } from "socket.io-client";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  // Load orders from backend
  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  // Handle order status change
  async function handleStatusChange(orderId: string, status: string) {
    try {
      await updateOrderStatus(orderId, status);
      // Optimistically update the order locally
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status } : o
        )
      );
    } catch (err: any) {
      alert(err?.response?.data?.error || "Update failed");
    }
  }

  useEffect(() => {
    loadOrders();

    // Connect to Socket.IO
    const newSocket = io("http://localhost:4003"); // backend order-service
    setSocket(newSocket);

    // Listen for new orders
    newSocket.on("orderCreated", (order: Order) => {
      setOrders((prev) => [order, ...prev]); // prepend new order
    });

    // Listen for status updates
    newSocket.on("orderUpdated", (updated: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && orders.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="overflow-x-auto bg-white border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Customer ID</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">{order.customerId}</td>
                  <td className="p-3">
                    {order.items.map((i) => (
                      <div key={i.id}>
                        {i.foodName} x {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-3">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="ON_THE_WAY">On the way</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
