import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/authStore";

export function RequireAuth() {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function RequireRole({ role }: { role: "ADMIN" | "CUSTOMER" }) {
  const { token, user } = useAuth();

  if (!token || !user) return <Navigate to="/login" replace />;

  if (user.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
}
