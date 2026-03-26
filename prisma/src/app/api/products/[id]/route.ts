// src/app/api/products/[id]/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/product/product.controller";

type Ctx = { params: { id: string } };

export const GET = (req: NextRequest, ctx: Ctx) =>
  withErrorHandler(() => controller.getProduct(req, ctx));

export const PATCH = (req: NextRequest, ctx: Ctx) =>
  withErrorHandler(() => controller.updateProduct(req, ctx));

export const DELETE = (req: NextRequest, ctx: Ctx) =>
  withErrorHandler(() => controller.deleteProduct(req, ctx));
