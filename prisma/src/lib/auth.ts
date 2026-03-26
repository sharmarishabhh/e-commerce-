// src/lib/auth.ts
// Thin JWT utilities used by the auth module and middleware

import { SignJWT, jwtVerify } from "jose";
import { UnauthorizedError } from "./errors";

export interface JwtPayload {
  sub: string;   // userId
  email: string;
  role: string;
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-me-in-production-please"
);

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JwtPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

/**
 * Extracts and verifies the Bearer token from an Authorization header.
 */
export async function extractUser(
  authHeader: string | null
): Promise<JwtPayload> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing bearer token");
  }
  const token = authHeader.slice(7);
  return verifyToken(token);
}
