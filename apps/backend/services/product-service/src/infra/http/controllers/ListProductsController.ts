import { BaseController, ok, type HttpResponse } from '@bts/http';
import type { PaginatedProductsResponse } from '@bts/core-models';
import { ListProductsUseCase } from '../../../core/use-cases/ListProductsUseCase.js';
import { listProductsRequestParser, type ListProductsRequest } from '../validation/product-request-parsers.js';
import { handleProductError } from './product-error-response.js';

export class ListProductsController extends BaseController<ListProductsRequest, PaginatedProductsResponse> {
  constructor(private readonly listProductsUseCase: ListProductsUseCase) {
    super(listProductsRequestParser, () => undefined, handleProductError);
  }

  async execute(request: ListProductsRequest): Promise<HttpResponse<PaginatedProductsResponse>> {
    const page = Number(request.query.page ?? 1) || 1;
    const limit = Number(request.query.limit ?? 10) || 10;
    const search = typeof request.query.search === 'string' ? request.query.search : undefined;
    const category = typeof request.query.category === 'string' ? request.query.category : undefined;

    const result = await this.listProductsUseCase.execute({
      search,
      category,
      page,
      limit,
    });
    return ok(result);
  }
}
