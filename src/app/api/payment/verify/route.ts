import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/payment/payment.controller";

export const POST = (req: NextRequest) =>
  withErrorHandler(async () => {
    console.log("🔥 [API HIT] /api/payment/verify");

    const body = await req.json();
    console.log("📦 Verify Request Body:", body);

    return controller.verifyPayment(body); // ✅ pass parsed body
  });