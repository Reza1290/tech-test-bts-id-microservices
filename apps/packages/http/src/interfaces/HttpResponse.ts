export type HttpStatusCode =
  | 200
  | 201
  | 204
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 429
  | 500
  | 501
  | 502
  | 503;

export type HttpResponse<TBody = never> =
  | Readonly<{ statusCode: 204; body?: never }>
  | Readonly<{
      statusCode: Exclude<HttpStatusCode, 204>;
      body: TBody;
    }>;

export interface ApiErrorBody {
  readonly code: string;
  readonly message: string;
  readonly details?: Readonly<Record<string, readonly string[]>>;
}
