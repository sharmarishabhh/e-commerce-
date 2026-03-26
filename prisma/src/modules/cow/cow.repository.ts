// src/modules/cow/cow.repository.ts
import { db } from "@/lib/db";
import { CowStatus, AdoptionStatus } from "@prisma/client";

const cowSelect = {
  id: true,
  name: true,
  breed: true,
  age: true,
  description: true,
  imageUrl: true,
  status: true,
  adoptionFee: true,
} as const;

export async function findAvailableCows() {
  return db.cow.findMany({
    where: { status: CowStatus.AVAILABLE },
    select: cowSelect,
  });
}

export async function findCowById(id: string) {
  return db.cow.findUnique({ where: { id }, select: cowSelect });
}

export async function markCowAdopted(id: string) {
  return db.cow.update({
    where: { id },
    data: { status: CowStatus.ADOPTED },
    select: cowSelect,
  });
}

export async function createAdoption(data: {
  cowId: string;
  userId: string;
  endDate?: Date;
}) {
  return db.cowAdoption.create({
    data: { ...data, status: AdoptionStatus.ACTIVE },
    select: {
      id: true,
      cowId: true,
      userId: true,
      status: true,
      startDate: true,
      endDate: true,
    },
  });
}

export async function findActiveAdoption(cowId: string) {
  return db.cowAdoption.findFirst({
    where: { cowId, status: AdoptionStatus.ACTIVE },
  });
}
