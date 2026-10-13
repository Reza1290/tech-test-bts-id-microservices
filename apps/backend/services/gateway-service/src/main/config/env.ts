import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().default('bts-id-recruitment-test-jwt-secret-key-supersecret'),
  PRODUCT_SERVICE_URL: z.string().default('http://localhost:3001'),
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string().default('postgres'),
  AUTH_DB_NAME: z.string().default('bts_auth'),
  DATABASE_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
