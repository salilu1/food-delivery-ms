import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as cartController from "../controllers/cartController";

const router = Router();

router.get("/", authenticate, cartController.getCart);
router.post("/decrement", authenticate, cartController.decrementFromCart);
router.post("/", authenticate, cartController.addToCart);
router.delete("/clear", authenticate, cartController.clearCart);
export default router;