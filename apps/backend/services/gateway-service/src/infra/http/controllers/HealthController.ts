import { BaseController, ok, type HttpResponse } from '@bts/http';
import { healthRequestParser, type HealthRequest } from '../validation/auth-request-parsers.js';

export interface HealthResponse {
  service: string;
  status: string;
  timestamp: string;
}

export class HealthController extends BaseController<HealthRequest, HealthResponse> {
  constructor() {
    super(healthRequestParser);
  }

  async execute(_request: HealthRequest): Promise<HttpResponse<HealthResponse>> {
    return ok({
      service: 'gateway-service',
      status: 'UP',
      timestamp: new Date().toISOString(),
    });
  }
}
