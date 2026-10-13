import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  price: z.number().positive(),
  description: z.string().nullable().optional(),
  category: z.string().min(1),
  images: z.array(z.string().min(1)).min(1),
  created_at: z.string(),
  created_by: z.string(),
  created_by_id: z.string(),
  updated_at: z.string(),
  updated_by: z.string(),
  updated_by_id: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().positive('Price must be a positive number'),
  description: z.string().optional().default(''),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string().min(1)).min(1, 'Images must contain at least 1 image'),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
  title: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  category: z.string().min(1).optional(),
  images: z.array(z.string().min(1)).min(1).optional(),
});

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export const ProductQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginatedProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}
