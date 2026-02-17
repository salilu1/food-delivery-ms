import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController";
import {
  requireAuth,
  requireCustomer,
  requireAdmin,
} from "../middleware/authMiddleware";

const router = Router();

// Customer
router.post("/", requireAuth, requireCustomer, createOrder);
router.get("/my", requireAuth, requireCustomer, getMyOrders);

// Admin
router.get("/", requireAuth, requireAdmin, getAllOrders);
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus);

export default router;
