// src/modules/product/product.repository.ts
// Only layer that talks to the DB. Zero business logic here.

import { db } from "@/lib/db";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductQuery,
  ProductWithCategory,
  PaginatedProducts,
} from "./product.types";

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  stock: true,
  imageUrl: true,
  isActive: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
} as const;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function findAllProducts(
  query: ProductQuery
): Promise<PaginatedProducts> {
  const { page, limit, categoryId, search } = query;
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    db.product.findMany({ where, select: productSelect, skip, take: limit, orderBy: { createdAt: "desc" } }),
    db.product.count({ where }),
  ]);

  return { items: items as ProductWithCategory[], total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function findProductById(
  id: string
): Promise<ProductWithCategory | null> {
  return db.product.findUnique({ where: { id }, select: productSelect }) as Promise<ProductWithCategory | null>;
}

export async function findProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  return db.product.findUnique({ where: { slug }, select: productSelect }) as Promise<ProductWithCategory | null>;
}

export async function createProduct(
  data: CreateProductInput
): Promise<ProductWithCategory> {
  const slug = slugify(data.name);
  return db.product.create({
    data: { ...data, slug },
    select: productSelect,
  }) as Promise<ProductWithCategory>;
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput
): Promise<ProductWithCategory> {
  const extra = data.name ? { slug: slugify(data.name) } : {};
  return db.product.update({
    where: { id },
    data: { ...data, ...extra },
    select: productSelect,
  }) as Promise<ProductWithCategory>;
}

export async function deleteProduct(id: string): Promise<void> {
  await db.product.delete({ where: { id } });
}

export async function decrementStock(
  id: string,
  quantity: number
): Promise<void> {
  await db.product.update({
    where: { id },
    data: { stock: { decrement: quantity } },
  });
}
