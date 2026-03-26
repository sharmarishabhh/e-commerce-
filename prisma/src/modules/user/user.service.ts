// src/modules/user/user.service.ts
import { NotFoundError } from "@/lib/errors";
import * as repo from "./user.repository";
import type {
  UpdateProfileInput,
  CreateAddressInput,
  UpdateAddressInput,
  UserProfile,
  AddressDetail,
} from "./user.types";

export async function getProfile(userId: string): Promise<UserProfile> {
  const user = await repo.findUserById(userId);
  if (!user) throw new NotFoundError("User");
  return user as unknown as UserProfile;
}

export async function updateProfile(
  userId: string,
  data: UpdateProfileInput
): Promise<UserProfile> {
  await getProfile(userId);
  return repo.updateUser(userId, data) as unknown as UserProfile;
}

export async function getAddresses(userId: string): Promise<AddressDetail[]> {
  return repo.findAddressesByUser(userId) as unknown as AddressDetail[];
}

export async function createAddress(
  userId: string,
  data: CreateAddressInput
): Promise<AddressDetail> {
  return repo.createAddress(userId, data) as unknown as AddressDetail;
}

export async function updateAddress(
  id: string,
  userId: string,
  data: UpdateAddressInput
): Promise<AddressDetail> {
  const existing = await repo.findAddressById(id, userId);
  if (!existing) throw new NotFoundError("Address");
  return repo.updateAddress(id, userId, data) as unknown as AddressDetail;
}

export async function deleteAddress(id: string, userId: string): Promise<void> {
  const existing = await repo.findAddressById(id, userId);
  if (!existing) throw new NotFoundError("Address");
  await repo.deleteAddress(id);
}
