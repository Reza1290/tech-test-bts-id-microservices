import test from 'node:test';
import assert from 'node:assert/strict';
import { CreateProductSchema, ProductQuerySchema } from '../apps/packages/core-models/dist/index.js';

test('CreateProductSchema rejects missing title', () => {
  const result = CreateProductSchema.safeParse({
    title: '',
    price: 99.99,
    category: 'Clothes',
    images: ['https://example.com/image.jpg'],
  });
  assert.equal(result.success, false);
});

test('CreateProductSchema rejects negative or zero price', () => {
  const result = CreateProductSchema.safeParse({
    title: 'Awesome T-Shirt',
    price: -10,
    category: 'Clothes',
    images: ['https://example.com/image.jpg'],
  });
  assert.equal(result.success, false);
});

test('CreateProductSchema rejects empty images array', () => {
  const result = CreateProductSchema.safeParse({
    title: 'Awesome T-Shirt',
    price: 99.99,
    category: 'Clothes',
    images: [],
  });
  assert.equal(result.success, false);
});

test('CreateProductSchema accepts valid product input', () => {
  const input = {
    title: 'Awesome T-Shirt',
    price: 99.99,
    description: 'High-quality cotton t-shirt',
    category: 'Clothes',
    images: ['https://placeimg.com/640/480/any'],
  };
  const result = CreateProductSchema.safeParse(input);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.title, 'Awesome T-Shirt');
    assert.equal(result.data.price, 99.99);
    assert.equal(result.data.category, 'Clothes');
  }
});

test('ProductQuerySchema supplies defaults for page and limit', () => {
  const parsed = ProductQuerySchema.parse({});
  assert.equal(parsed.page, 1);
  assert.equal(parsed.limit, 10);
});

test('ProductQuerySchema parses filters', () => {
  const parsed = ProductQuerySchema.parse({
    search: 'shirt',
    category: 'Clothes',
    page: '2',
    limit: '5',
  });
  assert.equal(parsed.search, 'shirt');
  assert.equal(parsed.category, 'Clothes');
  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 5);
});
