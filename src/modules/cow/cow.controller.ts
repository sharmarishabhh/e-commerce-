// src/modules/cow/cow.controller.ts
import { NextRequest } from "next/server";
import { ValidationError } from "@/lib/errors";
import { successResponse, createdResponse } from "@/lib/response";
import { extractUser } from "@/lib/auth";
import * as service from "./cow.service";
import { CowIdSchema, AdoptCowSchema } from "./cow.types";

export async function listCows(_req: NextRequest) {
  const cows = await service.listCows();
  return successResponse(cows);
}

export async function getCow(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = CowIdSchema.parse(params);
  const cow = await service.getCow(id);
  return successResponse(cow);
}

export async function adoptCow(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await extractUser(req.headers.get("authorization"));
  const { id } = CowIdSchema.parse(params);
  const body = await req.json().catch(() => ({}));
  const data = AdoptCowSchema.parse(body);
  const adoption = await service.adoptCow(id, user.sub, data);
  return createdResponse(adoption);
}
