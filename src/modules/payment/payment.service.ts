import crypto from "crypto";
import { BadRequestError } from "@/lib/errors";
import { db } from "@/lib/db";
import * as paymentRepo from "./payment.repository";
import * as couponService from "@/modules/coupon/coupon.service";
import * as productRepo from "@/modules/product/product.repository";
import type { CreatePaymentOrderInput, VerifyPaymentInput, RazorpayOrderResult } from "./payment.types";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function createPaymentOrder(input: CreatePaymentOrderInput): Promise<RazorpayOrderResult> {
  console.log("[payment] createPaymentOrder input:", JSON.stringify(input, null, 2));

  const originalAmount = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  console.log("[payment] originalAmount:", originalAmount);

  let discountAmount = 0;
  let couponId: string | undefined;
  let couponCode: string | undefined;

  if (input.couponCode) {
    console.log("[payment] validating coupon:", input.couponCode);
    const couponResult = await couponService.validateCoupon({ code: input.couponCode, orderAmount: originalAmount });
    console.log("[payment] couponResult:", couponResult);
    if (!couponResult.valid) throw new BadRequestError(couponResult.reason);
    discountAmount = couponResult.discountAmount;
    couponId = couponResult.couponId;
    couponCode = couponResult.code;
  }

  const finalAmount = Math.max(originalAmount - discountAmount, 0);
  console.log("[payment] finalAmount:", finalAmount);

  console.log("[payment] creating address...");
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
  console.log("[payment] address created:", address.id);

  console.log("[payment] creating order...");
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
  console.log("[payment] order created:", order.id);

  const amountInPaise = Math.round(finalAmount * 100);
  console.log("[payment] calling Razorpay, amount paise:", amountInPaise);

  const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64"),
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.id,
      notes: { internalOrderId: order.id, couponCode: couponCode ?? "", customerName: input.customerName, customerEmail: input.customerEmail },
    }),
  });

  console.log("[payment] razorpay status:", razorpayRes.status);
  if (!razorpayRes.ok) {
    const err = await razorpayRes.text();
    console.error("[payment] razorpay error:", err);
    throw new BadRequestError(`Payment gateway error: ${err}`);
  }

  const razorpayOrder = await razorpayRes.json();
  console.log("[payment] razorpay order id:", razorpayOrder.id);

  await paymentRepo.createPaymentRecord({ orderId: order.id, razorpayOrderId: razorpayOrder.id, amount: finalAmount });
  console.log("[payment] payment record saved");

  if (couponId) await couponService.incrementUsage(couponId);

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
  console.log("[payment] verifyPayment input:", input);

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== input.razorpaySignature) throw new BadRequestError("Payment verification failed — invalid signature");

  const payment = await paymentRepo.markPaymentSuccess({
    razorpayOrderId: input.razorpayOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    razorpaySignature: input.razorpaySignature,
  });
  console.log("[payment] payment marked success:", payment.id);

  const orderItems = await db.orderItem.findMany({ where: { orderId: payment.orderId } });
  console.log("[payment] decrementing stock for", orderItems.length, "items");
  await Promise.all(orderItems.map((item) => productRepo.decrementStock(item.productId, item.quantity)));

  return { success: true, orderId: input.internalOrderId };
}