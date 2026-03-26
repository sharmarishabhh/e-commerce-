// src/modules/donation/donation.types.ts
import { z } from "zod";

export const CreateDonationSchema = z.object({
  amount: z.number().positive().min(1),
  message: z.string().max(500).optional(),
});

export type CreateDonationInput = z.infer<typeof CreateDonationSchema>;

export interface DonationResult {
  id: string;
  amount: number;
  message: string | null;
  status: string;
  createdAt: Date;
}
