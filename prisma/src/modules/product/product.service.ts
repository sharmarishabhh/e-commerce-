// src/modules/product/product.service.ts
// Business logic layer. Orchestrates repository calls and enforces rules.

import { NotFoundError, ConflictError } from "@/lib/errors";
import * as repo from "./product.repository";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductQuery,
  PaginatedProducts,
  ProductWithCategory,
} from "./product.types";

export async function getAllProducts(
  query: ProductQuery
): Promise<PaginatedProducts> {
  return repo.findAllProducts(query);
}

export async function getProductById(id: string): Promise<ProductWithCategory> {
  const product = await repo.findProductById(id);
  if (!product) throw new NotFoundError("Product");
  return product;
}

export async function createProduct(
  data: CreateProductInput
): Promise<ProductWithCategory> {
  // Guard: duplicate slug would violate DB unique constraint — give a clean error
  const existing = await repo.findProductBySlug(
    data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  );
  if (existing) throw new ConflictError("A product with this name already exists");

  return repo.createProduct(data);
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput
): Promise<ProductWithCategory> {
  // Ensure exists
  await getProductById(id);
  return repo.updateProduct(id, data);
}

export async function deleteProduct(id: string): Promise<void> {
  await getProductById(id);
  await repo.deleteProduct(id);
}
