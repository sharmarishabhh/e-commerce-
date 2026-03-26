// src/modules/product/product.controller.ts
// Receives parsed inputs from route handlers, delegates to service, returns NextResponse.

import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { ValidationError, ForbiddenError } from "@/lib/errors";
import { successResponse, createdResponse } from "@/lib/response";
import { extractUser } from "@/lib/auth";
import * as service from "./product.service";
import {
  CreateProductSchema,
  UpdateProductSchema,
  ProductIdSchema,
  ProductQuerySchema,
} from "./product.types";

export async function listProducts(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const query = ProductQuerySchema.parse(params);
  const result = await service.getAllProducts(query);
  return successResponse(result);
}

export async function getProduct(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = ProductIdSchema.parse(params);
  const product = await service.getProductById(id);
  return successResponse(product);
}

export async function createProduct(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  if (user.role !== "ADMIN") throw new ForbiddenError("Admin only");

  const body = await req.json().catch(() => {
    throw new ValidationError("Invalid JSON body");
  });
  const data = CreateProductSchema.parse(body);
  const product = await service.createProduct(data);
  return createdResponse(product);
}

export async function updateProduct(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await extractUser(req.headers.get("authorization"));
  if (user.role !== "ADMIN") throw new ForbiddenError("Admin only");

  const { id } = ProductIdSchema.parse(params);
  const body = await req.json().catch(() => {
    throw new ValidationError("Invalid JSON body");
  });

  try {
    const data = UpdateProductSchema.parse(body);
    const product = await service.updateProduct(id, data);
    return successResponse(product);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(err.errors[0]?.message ?? "Validation failed");
    }
    throw err;
  }
}

export async function deleteProduct(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await extractUser(req.headers.get("authorization"));
  if (user.role !== "ADMIN") throw new ForbiddenError("Admin only");

  const { id } = ProductIdSchema.parse(params);
  await service.deleteProduct(id);
  return successResponse({ message: "Product deleted" });
}
