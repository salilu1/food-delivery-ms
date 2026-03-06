import { Router } from "express";
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, markOrderPaid, markOrderFailed } from "../controllers/orderController";
import { requireAuth, requireCustomer, requireAdmin, requireInternal } from "../middleware/authMiddleware";

const router = Router();

// Customer routes
router.post("/", requireAuth, requireCustomer, createOrder);
router.get("/my", requireAuth, requireCustomer, getMyOrders);

// Admin routes
router.get("/", requireAuth, requireAdmin, getAllOrders);
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus);
router.patch(
  "/internal/:id/pay",
  requireInternal,
  markOrderPaid
);
router.patch(
  "/internal/:id/fail",
  requireInternal,
  markOrderFailed
);

export default router;
