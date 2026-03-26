// src/app/api/coupons/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/coupon/coupon.controller";

export const POST = (req: NextRequest) =>
  withErrorHandler(() => controller.validateCoupon(req));
