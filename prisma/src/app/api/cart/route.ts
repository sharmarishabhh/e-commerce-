// src/app/api/cart/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/cart/cart.controller";

export const GET = (req: NextRequest) =>
  withErrorHandler(() => controller.getCart(req));

export const POST = (req: NextRequest) =>
  withErrorHandler(() => controller.addItem(req));
