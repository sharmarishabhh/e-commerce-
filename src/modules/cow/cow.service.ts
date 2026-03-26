// src/modules/cow/cow.service.ts
import { NotFoundError, ConflictError } from "@/lib/errors";
import * as repo from "./cow.repository";
import type { AdoptCowInput, CowDetail, AdoptionResult } from "./cow.types";

export async function listCows(): Promise<CowDetail[]> {
  return repo.findAvailableCows() as unknown as CowDetail[];
}

export async function getCow(id: string): Promise<CowDetail> {
  const cow = await repo.findCowById(id);
  if (!cow) throw new NotFoundError("Cow");
  return cow as unknown as CowDetail;
}

export async function adoptCow(
  cowId: string,
  userId: string,
  input: AdoptCowInput
): Promise<AdoptionResult> {
  const cow = await getCow(cowId);
  if (cow.status !== "AVAILABLE") {
    throw new ConflictError("This cow has already been adopted");
  }

  const existing = await repo.findActiveAdoption(cowId);
  if (existing) throw new ConflictError("This cow already has an active adoption");

  const adoption = await repo.createAdoption({
    cowId,
    userId,
    endDate: input.endDate,
  });

  await repo.markCowAdopted(cowId);

  return adoption as unknown as AdoptionResult;
}
