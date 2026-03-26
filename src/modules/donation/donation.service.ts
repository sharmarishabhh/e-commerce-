// src/modules/donation/donation.service.ts
import * as repo from "./donation.repository";
import type { CreateDonationInput, DonationResult } from "./donation.types";

export async function createDonation(
  userId: string,
  input: CreateDonationInput
): Promise<DonationResult> {
  return repo.createDonation({ userId, ...input }) as unknown as DonationResult;
}

export async function getUserDonations(userId: string): Promise<DonationResult[]> {
  return repo.findDonationsByUser(userId) as unknown as DonationResult[];
}
