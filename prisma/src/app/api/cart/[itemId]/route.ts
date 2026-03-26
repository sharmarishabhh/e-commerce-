// src/app/api/cart/[itemId]/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/cart/cart.controller";

type Ctx = { params: { itemId: string } };

export const DELETE = (req: NextRequest, ctx: Ctx) =>
  withErrorHandler(() => controller.removeItem(req, ctx));
