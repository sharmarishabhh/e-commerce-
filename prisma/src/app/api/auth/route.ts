// src/app/api/auth/route.ts
import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/response";
import * as controller from "@/modules/auth/auth.controller";

export async function POST(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.endsWith("/signup")) {
    return withErrorHandler(() => controller.signup(req));
  }
  if (pathname.endsWith("/login")) {
    return withErrorHandler(() => controller.login(req));
  }

  return Response.json({ success: false, error: "Not found" }, { status: 404 });
}
