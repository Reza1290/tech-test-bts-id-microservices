export class ServerError extends Error {
  public readonly code = 'INTERNAL_SERVER_ERROR';

  constructor(cause?: unknown) {
    super('Internal server error', cause === undefined ? undefined : { cause });
    this.name = 'ServerError';
  }
}
