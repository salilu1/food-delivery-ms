import { Request, Response } from "express";
import * as cartService from "../services/cartService";

export const getCart = async (req: any, res: Response) => {
  const cart = await cartService.getCart(req.user.userId);
  res.json(cart);
};

export const addToCart = async (req: any, res: Response) => {
  const { foodId } = req.body;

  const item = await cartService.addItem(req.user.userId, foodId);
  res.json(item);
};
export const decrementFromCart = async (req: any, res: Response) => {
  const { foodId } = req.body;

  const item = await cartService.decrementItem(
    req.user.userId,
    foodId
  );

  res.json(item);
};
export const clearCart = async (req: any, res: Response) => {
  try {
    await cartService.clearCart(req.user.userId);
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Failed to clear cart:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};