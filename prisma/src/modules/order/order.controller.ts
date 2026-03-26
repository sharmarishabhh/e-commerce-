// src/modules/order/order.controller.ts
import { NextRequest } from "next/server";
import { ValidationError } from "@/lib/errors";
import { successResponse, createdResponse } from "@/lib/response";
import { extractUser } from "@/lib/auth";
import * as service from "./order.service";
import { CreateOrderSchema, OrderIdSchema } from "./order.types";

export async function createOrder(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  const body = await req.json().catch(() => { throw new ValidationError("Invalid JSON body"); });
  const data = CreateOrderSchema.parse(body);
  const order = await service.createOrderFromCart(user.sub, data);
  return createdResponse(order);
}

export async function listOrders(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  const orders = await service.getUserOrders(user.sub);
  return successResponse(orders);
}

export async function getOrder(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await extractUser(req.headers.get("authorization"));
  const { id } = OrderIdSchema.parse(params);
  const order = await service.getOrderById(id, user.sub);
  return successResponse(order);
}
