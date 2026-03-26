// src/modules/payment/payment.types.ts
import { z } from "zod";

export const CreatePaymentOrderSchema = z.object({
  // Cart items + address + optional coupon — full checkout payload
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().int().min(1),
    })
  ).min(1),
  address: z.object({
    line1: z.string().min(3),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(4),
    country: z.string().default("IN"),
  }),
  couponCode: z.string().optional(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  notes: z.string().optional(),
});

export const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  internalOrderId: z.string(),   // our DB order id
});

export type CreatePaymentOrderInput = z.infer<typeof CreatePaymentOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;

export interface RazorpayOrderResult {
  razorpayOrderId: string;
  internalOrderId: string;
  amount: number;          // in paise (₹ × 100)
  currency: string;
  keyId: string;           // Razorpay public key — safe to send to client
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}
