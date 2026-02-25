import { Request, Response } from "express";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { io } from "../index";
import axios from "axios";

const prisma = new PrismaClient();
const CATALOG_SERVICE_URL =
  process.env.CATALOG_SERVICE_URL || "http://127.0.0.1:4002";

/**
 * Customer creates an order
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
   // inside createOrder
const user = (req as any).user;

// Call auth-service to get user details
const userResponse = await axios.get(
  `http://127.0.0.1:4001/auth/users/${user.userId}`
);

const userData = userResponse.data;
    console.log("Decoded user from token:",userData);
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    const orderItems = [];
    let totalPrice = 0;

    // Fetch each food info from catalog-service
    for (const item of items) {
      if (!item.foodId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: "Invalid order item format" });
      }

      const resp = await axios.get(`${CATALOG_SERVICE_URL}/catalog/${item.foodId}`);
      const food = resp.data;

      if (!food) {
        return res.status(404).json({ error: `Food not found: ${item.foodId}` });
      }

      const unitPrice = Number(food.price);
      const foodName = String(food.name);

      orderItems.push({
        foodId: food.id,
        foodName,
        unitPrice,
        quantity: Number(item.quantity),
      });

      totalPrice += unitPrice * Number(item.quantity);
    }

    // Create order in database
    // When creating order in order-service
const order = await prisma.order.create({
  data: {
    customerId: user.userId,
    customerName: userData.name,
    customerEmail: userData.email,
    status: OrderStatus.PENDING,
    totalPrice,
    items: { create: orderItems },
  },
  include: { items: true },
});
    res.status(201).json(order);
  } catch (err: any) {
    console.error(err);

    if (axios.isAxiosError(err)) {
      return res.status(502).json({
        error: "Catalog service unavailable",
        details: err.message,
      });
    }

    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Customer views their orders
 */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const orders = await prisma.order.findMany({
      where: { customerId: user.userId },
      orderBy: { createdAt: "desc" },
      include: { items: true }, // include only items
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Admin views all orders
 */
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true, // include order items
      },
    });

    // Send orders with customer info directly from order fields
    res.json(
      orders.map((order) => ({
        ...order,
        customer: {
          name: order.customerName,
          email: order.customerEmail,
        },
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
/**
 * Admin updates order status
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: "Status is required" });

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true }, // only items
    });

    // Notify the customer via Socket.IO
    io.to(updated.customerId).emit("orderUpdated", updated);

    res.json(updated);
  } catch (err: any) {
    console.error(err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(500).json({ error: "Server error" });
  }
};
