// src/modules/coupon/coupon.controller.ts
import { NextRequest } from "next/server";
import { ValidationError } from "@/lib/errors";
import { successResponse } from "@/lib/response";
import * as service from "./coupon.service";
import { ValidateCouponSchema } from "./coupon.types";

export async function validateCoupon(req: NextRequest) {
  const body = await req.json().catch(() => {
    throw new ValidationError("Invalid JSON body");
  });
  const data = ValidateCouponSchema.parse(body);
  const result = await service.validateCoupon(data);
  return successResponse(result);
}
