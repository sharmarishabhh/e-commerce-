// src/app/api/orders/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/order/order.controller";

export const GET = (req: NextRequest) =>
  withErrorHandler(() => controller.listOrders(req));

export const POST = (req: NextRequest) =>
  withErrorHandler(() => controller.createOrder(req));
