// src/modules/payment/payment.controller.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { ValidationError } from "@/lib/errors";
import { successResponse, createdResponse } from "@/lib/response";
import * as service from "./payment.service";
import { CreatePaymentOrderSchema, VerifyPaymentSchema } from "./payment.types";

export async function createOrder(req: NextRequest) {
  const body = await req.json().catch(() => {
    throw new ValidationError("Invalid JSON body");
  });

  let data;
  try {
    data = CreatePaymentOrderSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new ValidationError(err.errors.map((e) => e.message).join(", "));
    }
    throw err;
  }

  const result = await service.createPaymentOrder(data);
  return createdResponse(result);
}

export async function verifyPayment(req: NextRequest) {
  const body = await req.json().catch(() => {
    throw new ValidationError("Invalid JSON body");
  });

  let data;
  try {
    data = VerifyPaymentSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new ValidationError(err.errors.map((e) => e.message).join(", "));
    }
    throw err;
  }

  const result = await service.verifyPayment(data);
  return successResponse(result);
}
