// src/modules/product/product.types.ts
import { z } from "zod";

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const CreateProductSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().cuid(),
  isActive: z.boolean().optional().default(true),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductIdSchema = z.object({
  id: z.string().cuid(),
});

export const ProductQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().cuid().optional(),
  search: z.string().optional(),
});

// ─── TypeScript Types ─────────────────────────────────────────────────────────

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductQuery = z.infer<typeof ProductQuerySchema>;

export interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PaginatedProducts {
  items: ProductWithCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
