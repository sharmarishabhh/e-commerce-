// src/modules/user/user.controller.ts
import { NextRequest } from "next/server";
import { ValidationError } from "@/lib/errors";
import { successResponse, createdResponse } from "@/lib/response";
import { extractUser } from "@/lib/auth";
import * as service from "./user.service";
import {
  UpdateProfileSchema,
  CreateAddressSchema,
  UpdateAddressSchema,
  AddressIdSchema,
} from "./user.types";

export async function getProfile(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  const profile = await service.getProfile(user.sub);
  return successResponse(profile);
}

export async function updateProfile(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  const body = await req.json().catch(() => { throw new ValidationError("Invalid JSON body"); });
  const data = UpdateProfileSchema.parse(body);
  const profile = await service.updateProfile(user.sub, data);
  return successResponse(profile);
}

export async function listAddresses(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  const addresses = await service.getAddresses(user.sub);
  return successResponse(addresses);
}

export async function createAddress(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  const body = await req.json().catch(() => { throw new ValidationError("Invalid JSON body"); });
  const data = CreateAddressSchema.parse(body);
  const address = await service.createAddress(user.sub, data);
  return createdResponse(address);
}

export async function updateAddress(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await extractUser(req.headers.get("authorization"));
  const { id } = AddressIdSchema.parse(params);
  const body = await req.json().catch(() => { throw new ValidationError("Invalid JSON body"); });
  const data = UpdateAddressSchema.parse(body);
  const address = await service.updateAddress(id, user.sub, data);
  return successResponse(address);
}

export async function deleteAddress(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await extractUser(req.headers.get("authorization"));
  const { id } = AddressIdSchema.parse(params);
  await service.deleteAddress(id, user.sub);
  return successResponse({ message: "Address deleted" });
}
