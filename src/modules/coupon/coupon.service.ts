import * as repo from "./coupon.repository";
import type { ValidateCouponInput, CouponResult } from "./coupon.types";

export async function validateCoupon(input: ValidateCouponInput): Promise<CouponResult> {
  const coupon = await repo.findCouponByCode(input.code);

  if (!coupon) return { valid: false, reason: "Invalid coupon code" };
  if (!coupon.isActive) return { valid: false, reason: "This coupon is no longer active" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, reason: "This coupon has expired" };
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) return { valid: false, reason: "This coupon has reached its usage limit" };
  if (input.orderAmount < coupon.minOrderAmount) return { valid: false, reason: `Minimum order amount of ₹${coupon.minOrderAmount} required` };

  const discountAmount =
    coupon.discountType === "PERCENTAGE"
      ? Math.floor((input.orderAmount * coupon.discountValue) / 100)
      : Math.min(coupon.discountValue, input.orderAmount);

  return {
    valid: true,
    couponId: coupon.id,
    code: coupon.code,
    discountType: coupon.discountType as "PERCENTAGE" | "FLAT",
    discountValue: coupon.discountValue,
    discountAmount,
    finalAmount: Math.max(0, input.orderAmount - discountAmount),
    promoterName: coupon.promoter?.name ?? null,
  };
}

export async function incrementUsage(couponId: string): Promise<void> {
  await repo.incrementCouponUsage(couponId);
}