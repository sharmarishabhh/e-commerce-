// src/modules/cart/cart.service.ts
import { NotFoundError, BadRequestError } from "@/lib/errors";
import * as repo from "./cart.repository";
import * as productRepo from "@/modules/product/product.repository";
import type { AddCartItemInput, CartWithItems } from "./cart.types";

function buildCartResponse(raw: Awaited<ReturnType<typeof repo.getCartWithItems>>): CartWithItems {
  if (!raw) throw new NotFoundError("Cart");
  const items = raw.items.map((item) => ({
    ...item,
    subtotal: item.product.price * item.quantity,
  }));
  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  return { id: raw.id, userId: raw.userId, items, total };
}

export async function getCart(userId: string): Promise<CartWithItems> {
  const cart = await repo.findOrCreateCart(userId);
  return buildCartResponse(cart);
}

export async function addItem(userId: string, input: AddCartItemInput): Promise<CartWithItems> {
  const product = await productRepo.findProductById(input.productId);
  if (!product) throw new NotFoundError("Product");
  if (product.stock < input.quantity) {
    throw new BadRequestError(`Only ${product.stock} units available`);
  }

  const cart = await repo.findOrCreateCart(userId);
  await repo.upsertCartItem(cart.id, input.productId, input.quantity);

  const updated = await repo.getCartWithItems(userId);
  return buildCartResponse(updated);
}

export async function removeItem(userId: string, itemId: string): Promise<CartWithItems> {
  const cart = await repo.findOrCreateCart(userId);
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw new NotFoundError("Cart item");

  await repo.removeCartItem(itemId);
  const updated = await repo.getCartWithItems(userId);
  return buildCartResponse(updated);
}
