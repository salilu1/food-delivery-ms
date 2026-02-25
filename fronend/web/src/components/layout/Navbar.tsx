import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

type FullUser = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useCartStore((state) => state.cartCount());

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fullUser, setFullUser] = useState<FullUser | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch full user info from auth service
  useEffect(() => {
    if (user?.userId) {
      axios
        .get(`http://172.24.111.254:4001/auth/users/${user.userId}`)
        .then((res) => setFullUser(res.data))
        .catch((err) => console.error("Failed to fetch user info", err));
    }
  }, [user?.userId]);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = "text-gray-600 hover:text-orange-600 transition-colors font-medium";

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl tracking-tight text-orange-600">TaemFood</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={navLinkClass}>Foods</Link>

            {user?.role === "CUSTOMER" && (
              <>
                <Link to="/orders" className={navLinkClass}>My Orders</Link>
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user?.role === "ADMIN" && (
              <>
                <Link to="/admin/foods" className={navLinkClass}>Admin Foods</Link>
                <Link to="/admin/orders" className={navLinkClass}>Admin Orders</Link>
              </>
            )}

            {!user ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className={navLinkClass}>Login</Link>
                <Link to="/register" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">Sign Up</Link>
              </div>
            ) : (
              // Profile dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
                    {fullUser?.name?.[0].toUpperCase()}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{fullUser?.name || user.userId}</p>
                    </div>
                    <Link to="/change-password" title="Change Password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                      Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             {user?.role === "CUSTOMER" && (
               <Link to="/cart" className="relative p-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full">{cartCount}</span>}
               </Link>
             )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b px-4 pt-2 pb-6 space-y-2 shadow-inner">
          <Link to="/" className="block py-2 text-base font-medium text-gray-700">Foods</Link>
          {user?.role === "CUSTOMER" && (
            <Link to="/orders" className="block py-2 text-base font-medium text-gray-700">My Orders</Link>
          )}
          {user?.role === "ADMIN" && (
            <>
              <Link to="/admin/foods" className="block py-2 text-base font-medium text-gray-700">Admin Foods</Link>
              <Link to="/admin/orders" className="block py-2 text-base font-medium text-gray-700">Admin Orders</Link>
            </>
          )}
          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <>
                <Link to="/change-password" title="Change Password" className="block py-2 text-base font-medium text-gray-700">Change Password</Link>
                <button onClick={handleLogout} className="block py-2 text-base font-medium text-red-600">Logout</button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="text-center py-2 font-medium text-gray-700">Login</Link>
                <Link to="/register" className="text-center bg-orange-600 text-white py-2 rounded-lg">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}