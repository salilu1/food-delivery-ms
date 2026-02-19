import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          FoodDelivery
        </Link>

        <nav className="flex gap-4 text-sm font-medium items-center">
          {/* Public */}
          <Link to="/">Foods</Link>

          {/* Customer links (only when logged in as CUSTOMER) */}
          {user?.role === "CUSTOMER" && (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/orders">My Orders</Link>
            </>
          )}

          {/* Admin links (only when logged in as ADMIN) */}
          {user?.role === "ADMIN" && (
            <>
              <Link to="/admin/foods">Admin Foods</Link>
              <Link to="/admin/orders">Admin Orders</Link>
            </>
          )}

          {/* Auth */}
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
