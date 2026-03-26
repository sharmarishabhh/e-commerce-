// src/app/api/users/addresses/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/user/user.controller";

export const GET = (req: NextRequest) =>
  withErrorHandler(() => controller.listAddresses(req));

export const POST = (req: NextRequest) =>
  withErrorHandler(() => controller.createAddress(req));
