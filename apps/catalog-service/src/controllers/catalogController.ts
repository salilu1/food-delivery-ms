import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFood = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    const file = req.file;

    if (!name || price === undefined || !file) {
      return res.status(400).json({ error: "Missing fields or image" });
    }

    // stored in DB
    const imagePath = `/uploads/${file.filename}`;

    const food = await prisma.food.create({
      data: {
        name,
        description,
        price: Number(price),
        image: imagePath,
      },
    });

    // build full URL for frontend
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      ...food,
      imageUrl: `${baseUrl}${food.image}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Public list foods
export const listFoods = async (req: Request, res: Response) => {
  try {
    const foods = await prisma.food.findMany({
      where: { available: true },
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const result = foods.map((f) => ({
      ...f,
      imageUrl: `${baseUrl}${f.image}`,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const listAllFoods = async (req: Request, res: Response) => {
  try {
    const foods = await prisma.food.findMany();

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const result = foods.map((f) => ({
      ...f,
      imageUrl: `${baseUrl}${f.image}`,
    }));

    res.json(result);
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

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      ...food,
      imageUrl: `${baseUrl}${food.image}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const updateFood = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { name, description, price, available } = req.body;
    const file = req.file;

    const existingFood = await prisma.food.findUnique({ where: { id } });

    if (!existingFood) {
      return res.status(404).json({ error: "Food not found" });
    }

    let imagePath = existingFood.image;

    // If new image uploaded → replace image path
    if (file) {
      imagePath = `/uploads/${file.filename}`;
    }

    const updatedFood = await prisma.food.update({
      where: { id },
      data: {
        name: name ?? existingFood.name,
        description: description ?? existingFood.description,
        price: price !== undefined ? Number(price) : existingFood.price,
        image: imagePath,
        available: available !== undefined ? available === "true" || available === true : existingFood.available,
      },
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      ...updatedFood,
      imageUrl: `${baseUrl}${updatedFood.image}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const deleteFood = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    await prisma.food.delete({
      where: { id },
    });

    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

