// src/modules/payment/payment.service.ts
import crypto from "crypto";
import { BadRequestError } from "@/lib/errors";
import { db } from "@/lib/db";
import * as paymentRepo from "./payment.repository";
import * as couponRepo from "@/modules/coupon/coupon.repository";
import * as couponService from "@/modules/coupon/coupon.service";
import type {
  CreatePaymentOrderInput,
  VerifyPaymentInput,
  RazorpayOrderResult,
} from "./payment.types";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function createPaymentOrder(
  input: CreatePaymentOrderInput
): Promise<RazorpayOrderResult> {
  // 1. Calculate amounts
  const originalAmount = input.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  let discountAmount = 0;
  let couponId: string | undefined;
  let couponCode: string | undefined;

  if (input.couponCode) {
    const couponResult = await couponService.validateCoupon({
      code: input.couponCode,
      orderAmount: originalAmount,
    });
    if (!couponResult.valid) throw new BadRequestError(couponResult.reason);
    discountAmount = couponResult.discountAmount;
    couponId = couponResult.couponId;
    couponCode = couponResult.code;
  }

  const finalAmount = Math.max(originalAmount - discountAmount, 0);

  // 2. Create address (guest — no userId)
  const address = await db.address.create({
    data: {
      label: "Delivery",
      line1: input.address.line1,
      line2: input.address.line2,
      city: input.address.city,
      state: input.address.state,
      postalCode: input.address.postalCode,
      country: input.address.country ?? "IN",
    },
  });

  // 3. Create order record (PENDING until payment confirmed)
  const order = await db.order.create({
    data: {
      addressId: address.id,
      originalAmount,
      discountAmount,
      totalAmount: finalAmount,
      couponId: couponId ?? null,
      couponCode: couponCode ?? null,
      notes: input.notes,
      items: {
        create: input.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
      },
    },
  });

  // 4. Create Razorpay order (no SDK — plain fetch)
  const amountInPaise = Math.round(finalAmount * 100);
  const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64"),
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.id,
      notes: {
        internalOrderId: order.id,
        couponCode: couponCode ?? "",
        customerName: input.customerName,
        customerEmail: input.customerEmail,
      },
    }),
  });

  if (!razorpayRes.ok) {
    const err = await razorpayRes.text();
    throw new BadRequestError(`Payment gateway error: ${err}`);
  }

  const razorpayOrder = await razorpayRes.json();

  // 5. Save Razorpay order id
  await paymentRepo.createPaymentRecord({
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: finalAmount,
  });

  // 6. Increment coupon usage counter
  if (couponId) await couponRepo.incrementCouponUsage(couponId);

  return {
    razorpayOrderId: razorpayOrder.id,
    internalOrderId: order.id,
    amount: amountInPaise,
    currency: "INR",
    keyId: RAZORPAY_KEY_ID,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
  };
}

export async function verifyPayment(input: VerifyPaymentInput) {
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== input.razorpaySignature) {
    throw new BadRequestError("Payment verification failed — invalid signature");
  }

  await paymentRepo.markPaymentSuccess({
    razorpayOrderId: input.razorpayOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    razorpaySignature: input.razorpaySignature,
  });

  return { success: true, orderId: input.internalOrderId };
}
