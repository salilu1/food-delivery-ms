import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useAuth } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function MainLayout() {
     const { token } = useAuth();
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (token) {
      fetchCart(token);
    }
  }, [token, fetchCart]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
