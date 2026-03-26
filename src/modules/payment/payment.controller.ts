import { z } from "zod";
import { ValidationError } from "@/lib/errors";
import { successResponse, createdResponse } from "@/lib/response";
import * as service from "./payment.service";
import { CreatePaymentOrderSchema, VerifyPaymentSchema } from "./payment.types";

// ✅ NOW accepts body instead of req
export async function createOrder(body: unknown) {
  let data;

  try {
    data = CreatePaymentOrderSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new ValidationError(
        err.issues.map((e) => e.message).join(", ")
      );
    }
    throw err;
  }

  const result = await service.createPaymentOrder(data);
  return createdResponse(result);
}

export async function verifyPayment(body: unknown) {
  let data;

  try {
    data = VerifyPaymentSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new ValidationError(
        err.issues.map((e) => e.message).join(", ")
      );
    }
    throw err;
  }

  const result = await service.verifyPayment(data);
  return successResponse(result);
}