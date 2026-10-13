import { BaseController, ok, type HttpResponse } from '@bts/http';
import type { ProductProps } from '../../../domain/entities/Product.js';
import { UpdateProductUseCase } from '../../../core/use-cases/UpdateProductUseCase.js';
import { updateProductRequestParser, type UpdateProductRequest } from '../validation/product-request-parsers.js';
import { handleProductError } from './product-error-response.js';
import { formatDateTime } from '../../../common/date.js';

export class UpdateProductController extends BaseController<UpdateProductRequest, ProductProps> {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {
    super(updateProductRequestParser, () => undefined, handleProductError);
  }

  async execute(request: UpdateProductRequest): Promise<HttpResponse<ProductProps>> {
    const id = Number(request.params.id);
    const body = request.body;
    const username = request.headers['x-username'] || 'Anonymous';
    const userId = request.headers['x-user-id'] || '1';
    const now = formatDateTime();

    const updated = await this.updateProductUseCase.execute(id, {
      title: body.title,
      price: body.price,
      description: body.description,
      category: body.category,
      images: body.images,
      updated_at: now,
      updated_by: username,
      updated_by_id: userId,
    });

    return ok(updated);
  }
}
