import test from 'node:test';
import assert from 'node:assert/strict';
import { RegisterSchema, LoginSchema } from '../apps/packages/core-models/dist/index.js';

test('RegisterSchema rejects mismatched password confirmation', () => {
  const result = RegisterSchema.safeParse({
    username: 'jhon_doe',
    password: 'supersecret',
    password_confirmation: 'wrongsecret',
  });
  assert.equal(result.success, false);
});

test('RegisterSchema rejects username less than 3 characters', () => {
  const result = RegisterSchema.safeParse({
    username: 'jh',
    password: 'supersecret',
    password_confirmation: 'supersecret',
  });
  assert.equal(result.success, false);
});

test('RegisterSchema accepts valid register payload', () => {
  const result = RegisterSchema.safeParse({
    username: 'jhon_doe',
    password: 'supersecret',
    password_confirmation: 'supersecret',
  });
  assert.equal(result.success, true);
});

test('LoginSchema rejects empty credentials', () => {
  assert.equal(LoginSchema.safeParse({ username: '', password: '123' }).success, false);
  assert.equal(LoginSchema.safeParse({ username: 'jhon', password: '' }).success, false);
});

test('LoginSchema accepts valid login credentials', () => {
  const result = LoginSchema.safeParse({
    username: 'jhon_doe',
    password: 'supersecret',
  });
  assert.equal(result.success, true);
});
