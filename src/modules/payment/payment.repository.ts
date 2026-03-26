// src/modules/payment/payment.repository.ts
import { db } from "@/lib/db";
import { PaymentStatus, OrderStatus } from "@prisma/client";

export async function createPaymentRecord(data: {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
}) {
  return db.payment.create({ data: { ...data, status: PaymentStatus.PENDING } });
}

export async function markPaymentSuccess(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const payment = await db.payment.update({
    where: { razorpayOrderId: data.razorpayOrderId },
    data: {
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
      status: PaymentStatus.PAID,
    },
  });

  // Update the linked order atomically
  await db.order.update({
    where: { id: payment.orderId },
    data: {
      paymentStatus: PaymentStatus.PAID,
      status: OrderStatus.CONFIRMED,
    },
  });

  return payment;
}

export async function findPaymentByRazorpayOrderId(razorpayOrderId: string) {
  return db.payment.findUnique({ where: { razorpayOrderId } });
}
