import type { IProductRepository, UpdateProductData } from '../interfaces/IProductRepository.js';
import type { ICacheProvider } from '../interfaces/ICacheProvider.js';
import type { ProductProps } from '../../domain/entities/Product.js';
import { ProductNotFoundError } from '../../domain/errors.js';

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute(id: number, data: UpdateProductData): Promise<ProductProps> {
    const updated = await this.productRepository.update(id, data);
    if (!updated) {
      throw new ProductNotFoundError(id);
    }
    await this.cacheProvider.clearByPrefix('products:');
    await this.cacheProvider.del(`products:detail:${id}`);
    return updated.toJSON();
  }
}
