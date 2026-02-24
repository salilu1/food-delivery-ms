// src/components/layout/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
   const cartCount = useCartStore((state) => state.cartCount());

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          TaemFood
        </Link>

        <nav className="flex gap-4 text-sm font-medium items-center">
          <Link to="/">Foods</Link>

          {user?.role === "CUSTOMER" && (
            <>
              <div className="relative">
        <Link to="/cart">🛒</Link>

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            {cartCount}
          </span>
        )}
      </div>
              <Link to="/orders">My Orders</Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link to="/admin/foods">Admin Foods</Link>
              <Link to="/admin/orders">Admin Orders</Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-black text-white px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}