import test from 'node:test';
import assert from 'node:assert/strict';
import { ok, created, noContent, badRequest, notFound, tooManyRequests } from '../apps/packages/http/dist/index.js';

test('HTTP helpers produce consistent status and response envelopes', () => {
  assert.deepEqual(ok({ id: 1 }), { statusCode: 200, body: { id: 1 } });
  assert.deepEqual(created({ id: 1 }), { statusCode: 201, body: { id: 1 } });
  assert.deepEqual(noContent(), { statusCode: 204 });
  assert.deepEqual(badRequest({ code: 'BAD_REQUEST', message: 'Invalid data' }), {
    statusCode: 400,
    body: { code: 'BAD_REQUEST', message: 'Invalid data' },
  });
  assert.deepEqual(notFound({ code: 'NOT_FOUND', message: 'Not found' }), {
    statusCode: 404,
    body: { code: 'NOT_FOUND', message: 'Not found' },
  });
  assert.deepEqual(tooManyRequests({ code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' }), {
    statusCode: 429,
    body: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
  });
});
