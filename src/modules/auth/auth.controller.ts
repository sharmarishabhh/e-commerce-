// src/modules/auth/auth.controller.ts
import { NextRequest } from "next/server";
import { ValidationError } from "@/lib/errors";
import { createdResponse, successResponse } from "@/lib/response";
import * as service from "./auth.service";
import { SignupSchema, LoginSchema } from "./auth.types";

export async function signup(req: NextRequest) {
  const body = await req.json().catch(() => {
    throw new ValidationError("Invalid JSON body");
  });
  const data = SignupSchema.parse(body);
  const result = await service.signup(data);
  return createdResponse(result);
}

export async function login(req: NextRequest) {
  const body = await req.json().catch(() => {
    throw new ValidationError("Invalid JSON body");
  });
  const data = LoginSchema.parse(body);
  const result = await service.login(data);
  return successResponse(result);
}
