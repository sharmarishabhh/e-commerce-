// src/modules/order/order.repository.ts
import { db } from "@/lib/db";

const orderSelect = {
  id: true,
  status: true,
  paymentStatus: true,
  totalAmount: true,
  notes: true,
  createdAt: true,
  address: { select: { line1: true, city: true, state: true, postalCode: true } },
  items: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      product: { select: { id: true, name: true, imageUrl: true } },
    },
  },
} as const;

export async function createOrder(data: {
  userId: string;
  addressId: string;
  totalAmount: number;
  notes?: string;
  items: { productId: string; quantity: number; unitPrice: number; totalPrice: number }[];
}) {
  const { items, ...orderData } = data;
  return db.order.create({
    data: {
      ...orderData,
      items: { create: items },
    },
    select: orderSelect,
  });
}

export async function findOrdersByUser(userId: string) {
  return db.order.findMany({
    where: { userId },
    select: orderSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function findOrderById(id: string, userId: string) {
  return db.order.findFirst({
    where: { id, userId },
    select: orderSelect,
  });
}
