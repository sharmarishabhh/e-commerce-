// src/modules/order/order.service.ts
import { BadRequestError, NotFoundError } from "@/lib/errors";
import * as repo from "./order.repository";
import * as cartRepo from "@/modules/cart/cart.repository";
import * as productRepo from "@/modules/product/product.repository";
import type { CreateOrderInput, OrderSummary } from "./order.types";

export async function createOrderFromCart(
  userId: string,
  input: CreateOrderInput
): Promise<OrderSummary> {
  const cart = await cartRepo.getCartWithItems(userId);
  if (!cart || cart.items.length === 0) {
    throw new BadRequestError("Cart is empty");
  }

  // Build order items & validate stock
  const items = cart.items.map((cartItem) => {
    const { product, quantity } = cartItem;
    if (product.stock < quantity) {
      throw new BadRequestError(`Insufficient stock for "${product.name}"`);
    }
    return {
      productId: product.id,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
    };
  });

  const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0);

  // Decrement stock for each product
  await Promise.all(
    items.map((item) => productRepo.decrementStock(item.productId, item.quantity))
  );

  const order = await repo.createOrder({
    userId,
    addressId: input.addressId,
    notes: input.notes,
    totalAmount,
    items,
  });

  // Clear cart after successful order
  await cartRepo.clearCart(cart.id);

  return order as unknown as OrderSummary;
}

export async function getUserOrders(userId: string): Promise<OrderSummary[]> {
  return repo.findOrdersByUser(userId) as unknown as OrderSummary[];
}

export async function getOrderById(id: string, userId: string): Promise<OrderSummary> {
  const order = await repo.findOrderById(id, userId);
  if (!order) throw new NotFoundError("Order");
  return order as unknown as OrderSummary;
}
