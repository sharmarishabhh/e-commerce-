// src/modules/cart/cart.types.ts
import { z } from "zod";

export const AddCartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(999),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(999),
});

export const CartItemIdSchema = z.object({
  itemId: z.string().cuid(),
});

export type AddCartItemInput = z.infer<typeof AddCartItemSchema>;

export interface CartWithItems {
  id: string;
  userId: string;
  items: CartItemDetail[];
  total: number;
}

export interface CartItemDetail {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
  };
  subtotal: number;
}
