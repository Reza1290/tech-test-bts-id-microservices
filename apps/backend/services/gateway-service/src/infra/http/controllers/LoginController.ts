import { BaseController, ok, type HttpResponse } from '@bts/http';
import { LoginUseCase } from '../../../core/use-cases/LoginUseCase.js';
import type { TokenPair } from '../../../core/interfaces/ITokenService.js';
import { loginRequestParser, type LoginRequest } from '../validation/auth-request-parsers.js';
import { handleAuthError } from './auth-error-response.js';

export class LoginController extends BaseController<LoginRequest, TokenPair> {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super(loginRequestParser, () => undefined, handleAuthError);
  }

  async execute(request: LoginRequest): Promise<HttpResponse<TokenPair>> {
    const tokens = await this.loginUseCase.execute(request.body);
    return ok(tokens);
  }
}
