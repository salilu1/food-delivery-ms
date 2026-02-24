import prisma from "../config/prisma";

export const getCart = async (userId: string) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });
};

export const addItem = async (userId: string, foodId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_foodId: {
        cartId: cart.id,
        foodId,
      },
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + 1 },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      foodId,
      quantity: 1,
    },
  });
};
export const decrementItem = async (userId: string, foodId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) return null;

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_foodId: {
        cartId: cart.id,
        foodId,
      },
    },
  });

  if (!existingItem) return null;

  if (existingItem.quantity <= 1) {
    return prisma.cartItem.delete({
      where: { id: existingItem.id },
    });
  }

  return prisma.cartItem.update({
    where: { id: existingItem.id },
    data: { quantity: existingItem.quantity - 1 },
  });
};
export const clearCart = async (userId: string) => {
  if (!userId) throw new Error("Invalid userId");

  // Find the cart
  const cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) {
    // No cart exists for this user → nothing to delete
    return;
  }

  // Delete all items in this cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};