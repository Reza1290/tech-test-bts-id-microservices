import type { IProductRepository, FindProductsParams } from '../interfaces/IProductRepository.js';
import type { ICacheProvider } from '../interfaces/ICacheProvider.js';
import type { PaginatedProductsResponse } from '@bts/core-models';

export class ListProductsUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute(params: FindProductsParams): Promise<PaginatedProductsResponse> {
    const cacheKey = `products:list:${params.page}:${params.limit}:${params.search ?? ''}:${params.category ?? ''}`;
    const cached = await this.cacheProvider.get<PaginatedProductsResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const { products, total } = await this.productRepository.findAll(params);
    const totalPages = Math.ceil(total / params.limit) || 1;

    const response: PaginatedProductsResponse = {
      data: products.map((p) => p.toJSON()),
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        total_pages: totalPages,
      },
    };

    await this.cacheProvider.set(cacheKey, response, 60);
    return response;
  }
}
