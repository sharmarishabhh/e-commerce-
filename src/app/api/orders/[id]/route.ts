// src/app/api/orders/[id]/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/order/order.controller";

type Ctx = { params: { id: string } };

export const GET = (req: NextRequest, ctx: Ctx) =>
  withErrorHandler(() => controller.getOrder(req, ctx));
