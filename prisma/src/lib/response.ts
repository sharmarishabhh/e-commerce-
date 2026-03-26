// src/lib/response.ts
// Standardised NextResponse wrappers used by every API route

import { NextResponse } from "next/server";
import { getStatusCode, getErrorMessage } from "./errors";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data } satisfies ApiResponse<T>, {
    status,
  });
}

export function createdResponse<T>(data: T): NextResponse {
  return successResponse(data, 201);
}

export function errorResponse(error: unknown): NextResponse {
  const status = getStatusCode(error);
  const message = getErrorMessage(error);
  return NextResponse.json(
    { success: false, error: message } satisfies ApiResponse,
    { status }
  );
}

/**
 * Wraps a controller function so that every unhandled error is caught once.
 * Use inside route handlers: `return withErrorHandler(() => controller.action(req))`
 */
export async function withErrorHandler(
  fn: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await fn();
  } catch (err) {
    return errorResponse(err);
  }
}
