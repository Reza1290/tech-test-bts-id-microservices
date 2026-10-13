import { notFound, badRequest, serverError, type HttpResponse, type ApiErrorBody } from '@bts/http';
import { ProductNotFoundError, ProductValidationError } from '../../../domain/errors.js';

export const handleProductError = (error: unknown): HttpResponse<ApiErrorBody> => {
  if (error instanceof ProductNotFoundError) {
    return notFound({ code: error.code, message: error.message });
  }
  if (error instanceof ProductValidationError) {
    return badRequest({ code: error.code, message: error.message });
  }
  return serverError(error);
};
