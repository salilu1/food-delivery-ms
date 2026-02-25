import { Router } from "express";
// import { authenticate } from "../middleware/auth";
import { requireAuth, requireCustomer, requireAdmin } from "../middleware/auth";
import * as cartController from "../controllers/cartController";

const router = Router();

router.get("/", requireAuth, requireCustomer, cartController.getCart);
router.post("/decrement", requireAuth, requireCustomer, cartController.decrementFromCart);
router.post("/", requireAuth, requireCustomer,cartController.addToCart);
router.delete("/clear", requireAuth, requireCustomer, cartController.clearCart);
export default router;