import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getMyOrders, type Order } from "../../services/orderService";
import { useAuth } from "../../store/authStore";

export default function MyOrdersPage() {
  const { user, token } = useAuth(); // grab token
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  // ✅ Load orders from backend with token
  async function loadOrders() {
    if (!user || !token) return;
    try {
      setLoading(true);
      setError("");
      const data = await getMyOrders(token); // pass token here
      setOrders(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user || !token) return;

    // Initialize socket
    const s = io("http://172.24.111.254:4003"); // order-service URL
    setSocket(s);

    // Join room with customerId
    s.emit("joinRoom", user.userId);

    // Listen for order updates
    s.on("orderUpdated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    });

    loadOrders();

    return () => {
      s.disconnect();
    };
  }, [user, token]);

  if (!user) return <p>Please login to view your orders.</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && orders.length === 0 && (
        <p className="text-gray-500">You have no orders yet.</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="overflow-x-auto bg-white border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">
                    {order.items.map((i) => (
                      <div key={i.id}>
                        {i.foodName} x {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-3">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}