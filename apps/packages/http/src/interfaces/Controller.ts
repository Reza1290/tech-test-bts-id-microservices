import type { ApiErrorBody, HttpResponse } from './HttpResponse.js';
import type { UntrustedHttpRequest } from './HttpRequest.js';

export interface Controller<TSuccess> {
  handle(request: UntrustedHttpRequest): Promise<HttpResponse<TSuccess | ApiErrorBody>>;
}
