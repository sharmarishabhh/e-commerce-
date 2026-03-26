// src/modules/donation/donation.repository.ts
import { db } from "@/lib/db";
import { DonationStatus } from "@prisma/client";

const donationSelect = {
  id: true,
  amount: true,
  message: true,
  status: true,
  createdAt: true,
} as const;

export async function createDonation(data: {
  userId: string;
  amount: number;
  message?: string;
}) {
  return db.donation.create({
    data: { ...data, status: DonationStatus.COMPLETED },
    select: donationSelect,
  });
}

export async function findDonationsByUser(userId: string) {
  return db.donation.findMany({
    where: { userId },
    select: donationSelect,
    orderBy: { createdAt: "desc" },
  });
}
