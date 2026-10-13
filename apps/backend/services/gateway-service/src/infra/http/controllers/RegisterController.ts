import { BaseController, created, type HttpResponse } from '@bts/http';
import { RegisterUseCase } from '../../../core/use-cases/RegisterUseCase.js';
import { registerRequestParser, type RegisterRequest } from '../validation/auth-request-parsers.js';
import { handleAuthError } from './auth-error-response.js';

export interface RegisteredUserResponse {
  id: number;
  username: string;
}

export class RegisterController extends BaseController<RegisterRequest, RegisteredUserResponse> {
  constructor(private readonly registerUseCase: RegisterUseCase) {
    super(registerRequestParser, () => undefined, handleAuthError);
  }

  async execute(request: RegisterRequest): Promise<HttpResponse<RegisteredUserResponse>> {
    const user = await this.registerUseCase.execute(request.body);
    return created(user);
  }
}
