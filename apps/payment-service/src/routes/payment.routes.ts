import { Router } from "express";
import { initializePayment, handleWebhook } from "../controllers/payment.controller";

const router = Router();

router.post("/initialize", initializePayment);
router.post("/webhook", handleWebhook);

export default router;