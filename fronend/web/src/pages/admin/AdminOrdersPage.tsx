import { useEffect, useMemo, useState, useCallback } from "react";
import { io } from "socket.io-client";
import {
  fetchOrders,
  updateOrderStatus,
  type Order,
} from "../../services/orderService";
import { useAuth } from "../../store/authStore";

const PAGE_SIZE = 8;

export default function AdminOrdersPage() {
  const { token, user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchOrders(token);
      setOrders(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      setError(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || user?.role !== "ADMIN") return;

    const socket = io("http://172.24.111.254:4003", {
      auth: { token },
    });

    socket.on("orderUpdated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    });

    loadOrders();

    return () => {
      socket.disconnect();
    };
  }, [token, user, loadOrders]);

  async function handleStatusChange(orderId: string, status: string) {
    if (!token) return;
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, status, token);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err: any) {
      alert(err?.message || "Update failed");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchStr = search.toLowerCase();
      const matchesSearch =
        order.customer?.name?.toLowerCase().includes(searchStr) ||
        order.customer?.email?.toLowerCase().includes(searchStr) ||
        order.id.toLowerCase().includes(searchStr);

      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalPrice : 0), 0);
    const active = orders.filter((o) => ["PENDING", "CONFIRMED", "PREPARING", "ON_THE_WAY"].includes(o.status)).length;
    return {
      total: orders.length,
      revenue: totalRevenue,
      active,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
    };
  }, [orders]);

  if (!token || user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100">
          <p className="text-red-600 font-bold text-lg">Access Denied</p>
          <p className="text-red-500 text-sm">You do not have administrative privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Order Management</h1>
          <p className="text-gray-500">Monitor live orders and business performance.</p>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="All Orders" value={analytics.total} icon="📦" color="blue" />
          <StatCard title="Net Revenue" value={`$${analytics.revenue.toFixed(2)}`} icon="💰" color="green" />
          <StatCard title="Active Now" value={analytics.active} icon="🔥" color="orange" />
          <StatCard title="Completed" value={analytics.delivered} icon="✅" color="purple" />
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by customer or Order ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 rounded-xl"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full md:w-auto border-gray-200 rounded-xl text-sm font-semibold focus:ring-orange-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PREPARING">Preparing</option>
              <option value="ON_THE_WAY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button onClick={loadOrders} className="p-2 text-gray-400 hover:text-orange-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Items</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Total</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{order.customer?.name}</p>
                    <p className="text-xs text-gray-400">{order.customer?.email}</p>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600 max-w-[200px] truncate">
                      {order.items.map(i => `${i.quantity}x ${i.foodName}`).join(", ")}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingOrderId === order.id}
                      className={`text-xs font-bold rounded-lg border-none focus:ring-2 focus:ring-offset-1 py-1 pr-8
                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                          'bg-orange-100 text-orange-700'}
                      `}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="ON_THE_WAY">On the Way</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              Showing {paginatedOrders.length} of {filteredOrders.length} orders
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-4 py-2 text-sm font-bold bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-4 py-2 text-sm font-bold bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: any; icon: string; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-2xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}