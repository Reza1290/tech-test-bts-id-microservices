import { BaseController, created, type HttpResponse } from '@bts/http';
import type { ProductProps } from '../../../domain/entities/Product.js';
import { CreateProductUseCase } from '../../../core/use-cases/CreateProductUseCase.js';
import { createProductRequestParser, type CreateProductRequest } from '../validation/product-request-parsers.js';
import { handleProductError } from './product-error-response.js';
import { formatDateTime } from '../../../common/date.js';

export class CreateProductController extends BaseController<CreateProductRequest, ProductProps> {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {
    super(createProductRequestParser, () => undefined, handleProductError);
  }

  async execute(request: CreateProductRequest): Promise<HttpResponse<ProductProps>> {
    const body = request.body;
    const username = request.headers['x-username'] || 'Anonymous';
    const userId = request.headers['x-user-id'] || '1';
    const now = formatDateTime();

    const product = await this.createProductUseCase.execute({
      title: body.title,
      price: body.price,
      description: body.description ?? '',
      category: body.category,
      images: body.images,
      created_at: now,
      created_by: username,
      created_by_id: userId,
      updated_at: now,
      updated_by: username,
      updated_by_id: userId,
    });

    return created(product);
  }
}
