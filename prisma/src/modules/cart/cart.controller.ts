// src/modules/cart/cart.controller.ts
import { NextRequest } from "next/server";
import { ValidationError } from "@/lib/errors";
import { successResponse } from "@/lib/response";
import { extractUser } from "@/lib/auth";
import * as service from "./cart.service";
import { AddCartItemSchema, CartItemIdSchema } from "./cart.types";

export async function getCart(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  const cart = await service.getCart(user.sub);
  return successResponse(cart);
}

export async function addItem(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  const body = await req.json().catch(() => { throw new ValidationError("Invalid JSON body"); });
  const data = AddCartItemSchema.parse(body);
  const cart = await service.addItem(user.sub, data);
  return successResponse(cart);
}

export async function removeItem(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const user = await extractUser(req.headers.get("authorization"));
  const { itemId } = CartItemIdSchema.parse(params);
  const cart = await service.removeItem(user.sub, itemId);
  return successResponse(cart);
}
