// src/app/api/cows/[id]/adopt/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/cow/cow.controller";

type Ctx = { params: { id: string } };

export const POST = (req: NextRequest, ctx: Ctx) =>
  withErrorHandler(() => controller.adoptCow(req, ctx));
