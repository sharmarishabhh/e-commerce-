import { NotFoundError, ConflictError } from "@/lib/errors";
import * as repo from "./product.repository";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductQuery,
  PaginatedProducts,
  ProductWithCategory,
} from "./product.types";

export async function getAllProducts(query: ProductQuery): Promise<PaginatedProducts> {
  return repo.findAllProducts(query);
}

export async function getProductById(id: string): Promise<ProductWithCategory> {
  const product = await repo.findProductById(id);
  if (!product) throw new NotFoundError("Product");
  return product;
}

// URL segment is a slug from the frontend but a cuid from direct API callers.
// Try slug first, fall back to id.
export async function getProductByIdOrSlug(idOrSlug: string): Promise<ProductWithCategory> {
  const looksLikeCuid = /^c[a-z0-9]{24}$/.test(idOrSlug);
  if (looksLikeCuid) {
    const byId = await repo.findProductById(idOrSlug);
    if (byId) return byId;
  }
  const bySlug = await repo.findProductBySlug(idOrSlug);
  if (bySlug) return bySlug;
  throw new NotFoundError("Product");
}

export async function createProduct(data: CreateProductInput): Promise<ProductWithCategory> {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const existing = await repo.findProductBySlug(slug);
  if (existing) throw new ConflictError("A product with this name already exists");
  return repo.createProduct(data);
}

export async function updateProduct(id: string, data: UpdateProductInput): Promise<ProductWithCategory> {
  await getProductById(id);
  return repo.updateProduct(id, data);
}

export async function deleteProduct(id: string): Promise<void> {
  await getProductById(id);
  await repo.deleteProduct(id);
}