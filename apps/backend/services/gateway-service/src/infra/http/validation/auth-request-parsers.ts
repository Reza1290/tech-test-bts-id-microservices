import { z } from 'zod';
import { ZodRequestParser, type HttpRequest, type HttpQueryValue } from '@bts/http';
import { RegisterSchema, LoginSchema, type RegisterInput, type LoginInput } from '@bts/core-models';

const headers = z.record(z.string().optional());
const params = z.record(z.string());
const queryValue = z.union([z.string(), z.array(z.string()), z.undefined()]);
const query = z.record(queryValue);
const envelope = { headers, params, query };

export type RegisterRequest = HttpRequest<RegisterInput>;
export type LoginRequest = HttpRequest<LoginInput>;
export type HealthRequest = HttpRequest<null>;

const registerSchema: z.ZodType<RegisterRequest> = z.object({
  ...envelope,
  body: RegisterSchema,
});

const loginSchema: z.ZodType<LoginRequest> = z.object({
  ...envelope,
  body: LoginSchema,
});

const healthSchema: z.ZodType<HealthRequest> = z.object({
  ...envelope,
  body: z.null(),
});

export const registerRequestParser = new ZodRequestParser<RegisterRequest>(registerSchema);
export const loginRequestParser = new ZodRequestParser<LoginRequest>(loginSchema);
export const healthRequestParser = new ZodRequestParser<HealthRequest>(healthSchema);
