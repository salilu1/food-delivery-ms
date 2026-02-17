import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Admin creates food
export const createFood = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    const file = req.file;

    if (!name || price === undefined || !file) {
      return res.status(400).json({ error: "Missing fields or image" });
    }

  
    const imagePath = `/uploads/${file.filename}`; // saved locally

    const food = await prisma.food.create({
      data: {
        name,
        description,
        price: Number(price),
        image: imagePath,
      },
    });

    res.json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Public list foods
export const listFoods = async (_req: Request, res: Response) => {
  try {
    const foods = await prisma.food.findMany({
      where: { available: true },
    });
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const getFoodById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const food = await prisma.food.findUnique({ where: { id } });

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
