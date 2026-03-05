import { Request, Response } from "express";
import { prisma } from "../prisma";
import { initializeChapaPayment, verifyChapaPayment } from "../services/chapaService";
import { confirmOrder, failOrder } from "../services/orderService";

// Initialize Payment
export async function initializePayment(req: Request, res: Response) {
  try {
    const { orderId, amount, email, name } = req.body;

    const tx_ref = `order-${orderId}-${Date.now()}`;

    const chapa = await initializeChapaPayment({
      amount,
      email,
      name,
      tx_ref,
    });

    await prisma.payment.create({
      data: {
        orderId,
        txRef: tx_ref,
        amount,
      },
    });

    res.json({ checkoutUrl: chapa.data.checkout_url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Webhook Handler
export async function handleWebhook(req: Request, res: Response) {
  try {
    const { tx_ref } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { txRef: tx_ref },
    });

    if (!payment) return res.status(404).send("Payment not found");

    // Idempotency protection
    if (payment.status === "SUCCESS") {
      return res.status(200).send("Already processed");
    }

    const verification = await verifyChapaPayment(tx_ref);

    if (verification.data.status === "success") {
      await prisma.payment.update({
        where: { txRef: tx_ref },
        data: {
          status: "SUCCESS",
          chapaReference: verification.data.reference,
        },
      });

      await confirmOrder(payment.orderId);
    } else {
      await prisma.payment.update({
        where: { txRef: tx_ref },
        data: { status: "FAILED" },
      });

      await failOrder(payment.orderId);
    }

    res.status(200).send("Webhook processed");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}