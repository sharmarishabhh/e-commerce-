import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/payment/payment.controller";

export const POST = async (req: NextRequest) => {
  console.log("🔥 [API HIT] /api/payment/create-order");

  try {
    const body = await req.json();
    console.log("📦 Request Body:", body);

    const result = await controller.createOrder(body);

    console.log("✅ SUCCESS:", result);

    return result;
  } catch (err) {
    console.error("💥 FULL ERROR:", err);
    throw err;
  }
};