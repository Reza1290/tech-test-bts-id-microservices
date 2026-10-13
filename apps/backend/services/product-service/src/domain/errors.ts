export class ProductNotFoundError extends Error {
  readonly code = 'PRODUCT_NOT_FOUND';
  constructor(id: number) {
    super(`Product with ID ${id} was not found`);
    this.name = 'ProductNotFoundError';
  }
}

export class ProductValidationError extends Error {
  readonly code = 'PRODUCT_VALIDATION_ERROR';
  constructor(message: string) {
    super(message);
    this.name = 'ProductValidationError';
  }
}
