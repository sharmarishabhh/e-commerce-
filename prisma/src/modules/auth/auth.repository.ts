// src/modules/auth/auth.repository.ts
import { db } from "@/lib/db";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  passwordHash: true,
} as const;

export async function findUserByEmail(email: string) {
  return db.user.findUnique({ where: { email }, select: userSelect });
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  return db.user.create({
    data,
    select: { id: true, name: true, email: true, role: true },
  });
}
