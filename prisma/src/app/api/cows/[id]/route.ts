// src/app/api/cows/[id]/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/cow/cow.controller";

type Ctx = { params: { id: string } };

export const GET = (req: NextRequest, ctx: Ctx) =>
  withErrorHandler(() => controller.getCow(req, ctx));
