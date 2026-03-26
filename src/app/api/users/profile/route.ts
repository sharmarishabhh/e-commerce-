// src/app/api/users/profile/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/user/user.controller";

export const GET = (req: NextRequest) =>
  withErrorHandler(() => controller.getProfile(req));

export const PATCH = (req: NextRequest) =>
  withErrorHandler(() => controller.updateProfile(req));
