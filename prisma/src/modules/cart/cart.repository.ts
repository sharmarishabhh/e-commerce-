// src/modules/cart/cart.repository.ts
import { db } from "@/lib/db";

const itemSelect = {
  id: true,
  quantity: true,
  product: {
    select: { id: true, name: true, price: true, imageUrl: true, stock: true },
  },
} as const;

export async function findOrCreateCart(userId: string) {
  return db.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true, userId: true, items: { select: itemSelect } },
  });
}

export async function findCartItem(cartId: string, productId: string) {
  return db.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
  });
}

export async function upsertCartItem(
  cartId: string,
  productId: string,
  quantity: number
) {
  return db.cartItem.upsert({
    where: { cartId_productId: { cartId, productId } },
    create: { cartId, productId, quantity },
    update: { quantity: { increment: quantity } },
    select: itemSelect,
  });
}

export async function removeCartItem(itemId: string) {
  await db.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart(cartId: string) {
  await db.cartItem.deleteMany({ where: { cartId } });
}

export async function getCartWithItems(userId: string) {
  return db.cart.findUnique({
    where: { userId },
    select: { id: true, userId: true, items: { select: itemSelect } },
  });
}
