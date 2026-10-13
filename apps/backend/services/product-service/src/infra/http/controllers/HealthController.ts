import { z } from 'zod';
import { BaseController, ok, ZodRequestParser, type HttpRequest, type HttpResponse } from '@bts/http';

export interface HealthResponse {
  service: string;
  status: string;
  timestamp: string;
}

const emptyParser = new ZodRequestParser(
  z.object({
    body: z.null(),
    params: z.record(z.string()),
    query: z.record(z.union([z.string(), z.array(z.string()), z.undefined()])),
    headers: z.record(z.string().optional()),
  }),
);

export class HealthController extends BaseController<HttpRequest<null>, HealthResponse> {
  constructor() {
    super(emptyParser);
  }

  async execute(_request: HttpRequest<null>): Promise<HttpResponse<HealthResponse>> {
    return ok({
      service: 'product-service',
      status: 'UP',
      timestamp: new Date().toISOString(),
    });
  }
}
