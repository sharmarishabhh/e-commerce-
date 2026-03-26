// src/app/api/payment/verify/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/payment/payment.controller";

export const POST = (req: NextRequest) =>
  withErrorHandler(() => controller.verifyPayment(req));
