import type { HttpRequest, UntrustedHttpRequest } from '../interfaces/HttpRequest.js';
import type { RequestParser, ValidationResult } from '../interfaces/Validation.js';

interface SafeParseSchema<T> {
  safeParse(input: unknown):
    | Readonly<{ success: true; data: T }>
    | Readonly<{
        success: false;
        error: Readonly<{
          issues: readonly Readonly<{
            path: readonly (string | number)[];
            message: string;
          }>[];
        }>;
      }>;
}

export class ZodRequestParser<TRequest extends HttpRequest<unknown>> implements RequestParser<TRequest> {
  constructor(private readonly schema: SafeParseSchema<TRequest>) {}

  public parse(request: UntrustedHttpRequest): ValidationResult<TRequest> {
    const parsed = this.schema.safeParse(request);
    if (parsed.success) return { success: true, data: parsed.data };

    const details: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join('.') || 'request';
      details[path] = [...(details[path] ?? []), issue.message];
    }

    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details,
      },
    };
  }
}
