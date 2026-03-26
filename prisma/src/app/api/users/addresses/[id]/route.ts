// src/app/api/users/addresses/[id]/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/user/user.controller";

type Ctx = { params: { id: string } };

export const PATCH = (req: NextRequest, ctx: Ctx) =>
  withErrorHandler(() => controller.updateAddress(req, ctx));

export const DELETE = (req: NextRequest, ctx: Ctx) =>
  withErrorHandler(() => controller.deleteAddress(req, ctx));
