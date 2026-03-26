// src/modules/order/order.types.ts
import { z } from "zod";

export const CreateOrderSchema = z.object({
  addressId: z.string().cuid(),
  notes: z.string().optional(),
});

export const OrderIdSchema = z.object({
  id: z.string().cuid(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export interface OrderSummary {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  notes: string | null;
  createdAt: Date;
  address: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: { id: string; name: string; imageUrl: string | null };
  }[];
}
