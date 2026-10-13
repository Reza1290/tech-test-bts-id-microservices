import { badRequest, serverError } from '../helpers/http.js';
import type { Controller } from '../interfaces/Controller.js';
import type { HttpRequest, UntrustedHttpRequest } from '../interfaces/HttpRequest.js';
import type { ApiErrorBody, HttpResponse } from '../interfaces/HttpResponse.js';
import type { RequestParser } from '../interfaces/Validation.js';

export abstract class BaseController<
  TRequest extends HttpRequest<unknown>,
  TSuccess,
> implements Controller<TSuccess> {
  constructor(
    private readonly parser: RequestParser<TRequest>,
    private readonly reportError: (error: unknown) => void = () => undefined,
    private readonly mapError: (error: unknown) => HttpResponse<ApiErrorBody> = serverError,
  ) {}

  public async handle(request: UntrustedHttpRequest): Promise<HttpResponse<TSuccess | ApiErrorBody>> {
    const parsed = this.parser.parse(request);
    if (!parsed.success) return badRequest(parsed.error);

    try {
      return await this.execute(parsed.data);
    } catch (error: unknown) {
      this.reportError(error);
      return this.mapError(error);
    }
  }

  protected abstract execute(request: TRequest): Promise<HttpResponse<TSuccess | ApiErrorBody>>;
}
