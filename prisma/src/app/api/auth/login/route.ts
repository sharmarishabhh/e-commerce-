// src/app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/auth/auth.controller";

export const POST = (req: NextRequest) =>
  withErrorHandler(() => controller.login(req));
