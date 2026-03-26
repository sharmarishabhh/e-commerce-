// src/modules/user/user.types.ts
import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
});

export const CreateAddressSchema = z.object({
  label: z.string().default("Home"),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().default("IN"),
  isDefault: z.boolean().default(false),
});

export const UpdateAddressSchema = CreateAddressSchema.partial();

export const AddressIdSchema = z.object({
  id: z.string().cuid(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface AddressDetail {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}
