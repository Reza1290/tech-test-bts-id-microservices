import { BaseController, noContent, type HttpResponse } from '@bts/http';
import { DeleteProductUseCase } from '../../../core/use-cases/DeleteProductUseCase.js';
import { deleteProductRequestParser, type DeleteProductRequest } from '../validation/product-request-parsers.js';
import { handleProductError } from './product-error-response.js';

export class DeleteProductController extends BaseController<DeleteProductRequest, never> {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {
    super(deleteProductRequestParser, () => undefined, handleProductError);
  }

  async execute(request: DeleteProductRequest): Promise<HttpResponse> {
    const id = Number(request.params.id);
    await this.deleteProductUseCase.execute(id);
    return noContent();
  }
}
