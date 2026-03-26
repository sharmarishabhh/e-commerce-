// src/modules/coupon/coupon.types.ts
import { z } from "zod";

export const ValidateCouponSchema = z.object({
  code: z.string().min(1).max(50).toUpperCase(),
  orderAmount: z.number().positive(),
});

export type ValidateCouponInput = z.infer<typeof ValidateCouponSchema>;

export interface CouponValidationResult {
  valid: true;
  couponId: string;
  code: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  discountAmount: number;   // actual ₹ off for this order
  finalAmount: number;
  promoterName: string | null;
}

export interface CouponValidationError {
  valid: false;
  reason: string;
}

export type CouponResult = CouponValidationResult | CouponValidationError;
