export type HttpHeaderValue = string | undefined;
export type HttpQueryValue = string | number | boolean | readonly string[] | undefined;

export interface HttpRequest<
  TBody = undefined,
  TParams extends Readonly<Record<string, string>> = Readonly<Record<string, string>>,
  TQuery extends Readonly<Record<string, HttpQueryValue>> = Readonly<Record<string, HttpQueryValue>>,
> {
  readonly body: TBody;
  readonly params: TParams;
  readonly query: TQuery;
  readonly headers: Readonly<Record<string, HttpHeaderValue>>;
}

export type UntrustedHttpRequest = HttpRequest<unknown>;
