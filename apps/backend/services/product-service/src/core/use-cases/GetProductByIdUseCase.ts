import type { IProductRepository } from '../interfaces/IProductRepository.js';
import type { ICacheProvider } from '../interfaces/ICacheProvider.js';
import type { ProductProps } from '../../domain/entities/Product.js';
import { ProductNotFoundError } from '../../domain/errors.js';

export class GetProductByIdUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute(id: number): Promise<ProductProps> {
    const cacheKey = `products:detail:${id}`;
    const cached = await this.cacheProvider.get<ProductProps>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }

    const result = product.toJSON();
    await this.cacheProvider.set(cacheKey, result, 60);
    return result;
  }
}
