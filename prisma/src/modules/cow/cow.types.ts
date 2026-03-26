// src/modules/cow/cow.types.ts
import { z } from "zod";

export const CowIdSchema = z.object({
  id: z.string().cuid(),
});

export const AdoptCowSchema = z.object({
  endDate: z.coerce.date().optional(),
});

export type AdoptCowInput = z.infer<typeof AdoptCowSchema>;

export interface CowDetail {
  id: string;
  name: string;
  breed: string | null;
  age: number | null;
  description: string | null;
  imageUrl: string | null;
  status: string;
  adoptionFee: number;
}

export interface AdoptionResult {
  id: string;
  cowId: string;
  userId: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
}
