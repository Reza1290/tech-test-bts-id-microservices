import type { ApiErrorBody } from './HttpResponse.js';
import type { HttpRequest, UntrustedHttpRequest } from './HttpRequest.js';

export type ValidationResult<TRequest extends HttpRequest<unknown>> =
  | Readonly<{ success: true; data: TRequest }>
  | Readonly<{ success: false; error: ApiErrorBody }>;

export interface RequestParser<TRequest extends HttpRequest<unknown>> {
  parse(request: UntrustedHttpRequest): ValidationResult<TRequest>;
}
