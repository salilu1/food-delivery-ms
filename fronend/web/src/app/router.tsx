import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import FoodsPage from "../pages/customer/FoodsPage";
import CartPage from "../pages/customer/CartPage";
import MyOrdersPage from "../pages/customer/MyOrdersPage";

import AdminFoodsPage from "../pages/admin/AdminFoodsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";

import { RequireAuth, RequireRole } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // public routes
      { path: "/", element: <FoodsPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

      // customer routes (must be logged in as CUSTOMER)
      {
        element: <RequireRole role="CUSTOMER" />,
        children: [
          { path: "/cart", element: <CartPage /> },
          { path: "/orders", element: <MyOrdersPage /> },
        ],
      },

      // admin routes (must be logged in as ADMIN)
      {
        element: <RequireRole role="ADMIN" />,
        children: [
          { path: "/admin/foods", element: <AdminFoodsPage /> },
          { path: "/admin/orders", element: <AdminOrdersPage /> },
        ],
      },
    ],
  },
]);
