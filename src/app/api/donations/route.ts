// src/app/api/donations/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/donation/donation.controller";

export const GET = (req: NextRequest) =>
  withErrorHandler(() => controller.listDonations(req));

export const POST = (req: NextRequest) =>
  withErrorHandler(() => controller.createDonation(req));
