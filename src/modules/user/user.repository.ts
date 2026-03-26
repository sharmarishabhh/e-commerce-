// src/modules/user/user.repository.ts
import { db } from "@/lib/db";

const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

const addressSelect = {
  id: true,
  label: true,
  line1: true,
  line2: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  isDefault: true,
} as const;

export async function findUserById(id: string) {
  return db.user.findUnique({ where: { id }, select: profileSelect });
}

export async function updateUser(id: string, data: { name?: string }) {
  return db.user.update({ where: { id }, data, select: profileSelect });
}

export async function findAddressesByUser(userId: string) {
  return db.address.findMany({ where: { userId }, select: addressSelect });
}

export async function findAddressById(id: string, userId: string) {
  return db.address.findFirst({ where: { id, userId }, select: addressSelect });
}

export async function createAddress(userId: string, data: {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}) {
  if (data.isDefault) {
    // Unset other defaults for this user first
    await db.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }
  return db.address.create({ data: { ...data, userId }, select: addressSelect });
}

export async function updateAddress(id: string, userId: string, data: Partial<{
  label: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}>) {
  if (data.isDefault) {
    await db.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }
  return db.address.update({ where: { id }, data, select: addressSelect });
}

export async function deleteAddress(id: string) {
  await db.address.delete({ where: { id } });
}
