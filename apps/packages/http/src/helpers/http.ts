import { ServerError } from '../errors/ServerError.js';
import type { ApiErrorBody, HttpResponse } from '../interfaces/HttpResponse.js';

export const ok = <T>(body: T): HttpResponse<T> => ({ statusCode: 200, body });

export const created = <T>(body: T): HttpResponse<T> => ({ statusCode: 201, body });

export const noContent = (): HttpResponse => ({ statusCode: 204 });

const errorResponse = (
  statusCode: 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 501 | 502 | 503,
  body: ApiErrorBody,
): HttpResponse<ApiErrorBody> => ({ statusCode, body });

export const badRequest = (body: ApiErrorBody): HttpResponse<ApiErrorBody> => errorResponse(400, body);
export const unauthorized = (body: ApiErrorBody): HttpResponse<ApiErrorBody> => errorResponse(401, body);
export const forbidden = (body: ApiErrorBody): HttpResponse<ApiErrorBody> => errorResponse(403, body);
export const notFound = (body: ApiErrorBody): HttpResponse<ApiErrorBody> => errorResponse(404, body);
export const conflict = (body: ApiErrorBody): HttpResponse<ApiErrorBody> => errorResponse(409, body);
export const unprocessableEntity = (body: ApiErrorBody): HttpResponse<ApiErrorBody> => errorResponse(422, body);
export const tooManyRequests = (body: ApiErrorBody): HttpResponse<ApiErrorBody> => errorResponse(429, body);
export const notImplemented = (body: ApiErrorBody): HttpResponse<ApiErrorBody> => errorResponse(501, body);
export const badGateway = (body: ApiErrorBody): HttpResponse<ApiErrorBody> => errorResponse(502, body);
export const serviceUnavailable = (body: ApiErrorBody): HttpResponse<ApiErrorBody> => errorResponse(503, body);

export const serverError = (cause?: unknown): HttpResponse<ApiErrorBody> => {
  const error = new ServerError(cause);
  return errorResponse(500, { code: error.code, message: error.message });
};
