// src/app/api/products/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/product/product.controller";

export const GET = (req: NextRequest) =>
  withErrorHandler(() => controller.listProducts(req));

export const POST = (req: NextRequest) =>
  withErrorHandler(() => controller.createProduct(req));
