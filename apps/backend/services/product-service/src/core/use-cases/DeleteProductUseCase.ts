import type { IProductRepository } from '../interfaces/IProductRepository.js';
import type { ICacheProvider } from '../interfaces/ICacheProvider.js';
import { ProductNotFoundError } from '../../domain/errors.js';

export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute(id: number): Promise<void> {
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new ProductNotFoundError(id);
    }
    await this.cacheProvider.clearByPrefix('products:');
    await this.cacheProvider.del(`products:detail:${id}`);
  }
}
