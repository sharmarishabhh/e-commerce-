// src/modules/coupon/coupon.repository.ts
import { db } from "@/lib/db";

export async function findCouponByCode(code: string) {
  return db.coupon.findUnique({
    where: { code: code.toUpperCase() },
    select: {
      id: true,
      code: true,
      discountType: true,
      discountValue: true,
      minOrderAmount: true,
      maxUses: true,
      usedCount: true,
      isActive: true,
      expiresAt: true,
      promoter: { select: { id: true, name: true } },
    },
  });
}

export async function incrementCouponUsage(couponId: string) {
  await db.coupon.update({
    where: { id: couponId },
    data: { usedCount: { increment: 1 } },
  });
}

// Seed helper: create promoter + coupon in one call
export async function createPromoterWithCoupon(data: {
  promoterName: string;
  promoterEmail: string;
  couponCode: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
}) {
  return db.promoter.create({
    data: {
      name: data.promoterName,
      email: data.promoterEmail,
      coupons: {
        create: {
          code: data.couponCode.toUpperCase(),
          discountType: data.discountType,
          discountValue: data.discountValue,
          minOrderAmount: data.minOrderAmount ?? 0,
          maxUses: data.maxUses ?? null,
        },
      },
    },
    include: { coupons: true },
  });
}
