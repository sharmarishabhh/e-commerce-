// src/modules/donation/donation.controller.ts
import { NextRequest } from "next/server";
import { ValidationError } from "@/lib/errors";
import { successResponse, createdResponse } from "@/lib/response";
import { extractUser } from "@/lib/auth";
import * as service from "./donation.service";
import { CreateDonationSchema } from "./donation.types";

export async function createDonation(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  const body = await req.json().catch(() => { throw new ValidationError("Invalid JSON body"); });
  const data = CreateDonationSchema.parse(body);
  const donation = await service.createDonation(user.sub, data);
  return createdResponse(donation);
}

export async function listDonations(req: NextRequest) {
  const user = await extractUser(req.headers.get("authorization"));
  const donations = await service.getUserDonations(user.sub);
  return successResponse(donations);
}
