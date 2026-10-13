import type { IProductRepository, CreateProductData } from '../interfaces/IProductRepository.js';
import type { ICacheProvider } from '../interfaces/ICacheProvider.js';
import type { ProductProps } from '../../domain/entities/Product.js';

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute(data: CreateProductData): Promise<ProductProps> {
    const createdProduct = await this.productRepository.create(data);
    await this.cacheProvider.clearByPrefix('products:');
    return createdProduct.toJSON();
  }
}
