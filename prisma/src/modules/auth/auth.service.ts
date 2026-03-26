// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import { ConflictError, UnauthorizedError } from "@/lib/errors";
import { signToken } from "@/lib/auth";
import * as repo from "./auth.repository";
import type { SignupInput, LoginInput, AuthResult } from "./auth.types";

export async function signup(data: SignupInput): Promise<AuthResult> {
  const existing = await repo.findUserByEmail(data.email);
  if (existing) throw new ConflictError("Email already in use");

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await repo.createUser({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  const token = await signToken({ sub: user.id, email: user.email, role: user.role });
  return { token, user };
}

export async function login(data: LoginInput): Promise<AuthResult> {
  const user = await repo.findUserByEmail(data.email);
  if (!user) throw new UnauthorizedError("Invalid credentials");

  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) throw new UnauthorizedError("Invalid credentials");

  const { passwordHash: _, ...safeUser } = user;
  const token = await signToken({ sub: safeUser.id, email: safeUser.email, role: safeUser.role });
  return { token, user: safeUser };
}
