// src/app/api/cows/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/cow/cow.controller";

export const GET = (req: NextRequest) =>
  withErrorHandler(() => controller.listCows(req));
