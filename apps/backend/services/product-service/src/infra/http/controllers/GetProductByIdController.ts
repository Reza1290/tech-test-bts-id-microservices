import { BaseController, ok, type HttpResponse } from '@bts/http';
import type { ProductProps } from '../../../domain/entities/Product.js';
import { GetProductByIdUseCase } from '../../../core/use-cases/GetProductByIdUseCase.js';
import { getProductByIdRequestParser, type GetProductByIdRequest } from '../validation/product-request-parsers.js';
import { handleProductError } from './product-error-response.js';

export class GetProductByIdController extends BaseController<GetProductByIdRequest, ProductProps> {
  constructor(private readonly getProductByIdUseCase: GetProductByIdUseCase) {
    super(getProductByIdRequestParser, () => undefined, handleProductError);
  }

  async execute(request: GetProductByIdRequest): Promise<HttpResponse<ProductProps>> {
    const id = Number(request.params.id);
    const product = await this.getProductByIdUseCase.execute(id);
    return ok(product);
  }
}
