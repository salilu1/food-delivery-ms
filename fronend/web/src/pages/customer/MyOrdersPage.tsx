import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getMyOrders, type Order } from "../../services/orderService";
import { useAuth } from "../../store/authStore";
import { Link } from "react-router-dom";

export default function MyOrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    if (!user || !token) return;
    try {
      setLoading(true);
      setError("");
      const data = await getMyOrders(token);
      // Sort by newest first
      setOrders(data.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (err: any) {
      setError(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (!user || !token) return;

    const s = io("http://172.24.111.254:4003");
    
    s.emit("joinRoom", user.userId);

    s.on("orderUpdated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    });

    loadOrders();

    return () => {
      s.disconnect();
    };
  }, [user, token, loadOrders]);

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
      case "PREPARING": return "bg-blue-100 text-blue-700 border-blue-200";
      case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 mb-4">Please login to view your orders.</p>
        <Link to="/login" className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold">Login Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-gray-500">Track your current and past meals</p>
        </div>
        <button 
          onClick={loadOrders}
          className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh List
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="text-5xl mb-4">🥡</div>
          <p className="text-gray-500 text-lg font-medium">You haven't placed any orders yet.</p>
          <Link to="/" className="mt-4 inline-block text-orange-600 font-bold hover:underline">Start browsing foods</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 md:p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                    <p className="font-mono text-sm text-gray-600">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1 italic">
                      Updated: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-b border-gray-50 py-4 mb-4">
                  {order.items.map((i) => (
                    <div key={i.id} className="flex justify-between items-center py-1">
                      <span className="text-gray-700 font-medium">
                        <span className="text-orange-600 font-bold mr-2">{i.quantity}x</span>
                        {i.foodName}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">Total Amount</p>
                    <p className="text-xl font-extrabold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  {/* <Link 
                    to={`/orders/${order.id}`}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    View Details
                  </Link> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}