import type { Product, ProductProps } from '../../domain/entities/Product.js';

export interface FindProductsParams {
  search?: string;
  category?: string;
  page: number;
  limit: number;
}

export interface FindProductsResult {
  products: Product[];
  total: number;
}

export interface CreateProductData {
  title: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  created_at: string;
  created_by: string;
  created_by_id: string;
  updated_at: string;
  updated_by: string;
  updated_by_id: string;
}

export interface UpdateProductData {
  title?: string;
  price?: number;
  description?: string;
  category?: string;
  images?: string[];
  updated_at: string;
  updated_by: string;
  updated_by_id: string;
}

export interface IProductRepository {
  findAll(params: FindProductsParams): Promise<FindProductsResult>;
  findById(id: number): Promise<Product | null>;
  create(data: CreateProductData): Promise<Product>;
  update(id: number, data: UpdateProductData): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
}
