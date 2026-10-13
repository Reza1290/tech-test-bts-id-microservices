import { conflict, unauthorized, serverError, type HttpResponse, type ApiErrorBody } from '@bts/http';
import { UserAlreadyExistsError, InvalidCredentialsError, UnauthorizedError } from '../../../domain/errors.js';

export const handleAuthError = (error: unknown): HttpResponse<ApiErrorBody> => {
  if (error instanceof UserAlreadyExistsError) {
    return conflict({ code: error.code, message: error.message });
  }
  if (error instanceof InvalidCredentialsError || error instanceof UnauthorizedError) {
    return unauthorized({ code: error.code, message: error.message });
  }
  return serverError(error);
};
