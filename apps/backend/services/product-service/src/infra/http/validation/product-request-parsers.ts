import { z } from 'zod';
import { ZodRequestParser, type HttpRequest, type HttpQueryValue } from '@bts/http';
import {
  CreateProductSchema,
  UpdateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from '@bts/core-models';

const headers = z.record(z.string().optional());
const params = z.record(z.string());
const queryValue = z.union([z.string(), z.array(z.string()), z.undefined()]);
const query = z.record(queryValue);
const envelope = { headers, params, query };

export type ListProductsRequest = HttpRequest<null, Readonly<Record<string, string>>, Readonly<Record<string, HttpQueryValue>>>;
export type GetProductByIdRequest = HttpRequest<null, Readonly<{ id: string }>>;
export type CreateProductRequest = HttpRequest<CreateProductInput>;
export type UpdateProductRequest = HttpRequest<UpdateProductInput, Readonly<{ id: string }>>;
export type DeleteProductRequest = HttpRequest<null, Readonly<{ id: string }>>;

const idParams = z.object({ id: z.string().min(1) });

const listProductsSchema: z.ZodType<ListProductsRequest> = z.object({
  ...envelope,
  body: z.null(),
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }).catchall(queryValue),
});

const getProductByIdSchema: z.ZodType<GetProductByIdRequest> = z.object({
  ...envelope,
  body: z.null(),
  params: idParams,
});

const createProductSchema: z.ZodType<CreateProductRequest, z.ZodTypeDef, unknown> = z.object({
  ...envelope,
  body: CreateProductSchema,
});

const updateProductSchema: z.ZodType<UpdateProductRequest> = z.object({
  ...envelope,
  params: idParams,
  body: UpdateProductSchema,
});

const deleteProductSchema: z.ZodType<DeleteProductRequest> = z.object({
  ...envelope,
  body: z.null(),
  params: idParams,
});

export const listProductsRequestParser = new ZodRequestParser<ListProductsRequest>(listProductsSchema);
export const getProductByIdRequestParser = new ZodRequestParser<GetProductByIdRequest>(getProductByIdSchema);
export const createProductRequestParser = new ZodRequestParser<CreateProductRequest>(createProductSchema);
export const updateProductRequestParser = new ZodRequestParser<UpdateProductRequest>(updateProductSchema);
export const deleteProductRequestParser = new ZodRequestParser<DeleteProductRequest>(deleteProductSchema);
