import { z } from 'zod';

export const RegisterSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    password_confirmation: z.string().min(6, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const AuthTokenResponseSchema = z.object({
  authentication_token: z.string(),
  refresh_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
});

export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;

export const UserPayloadSchema = z.object({
  sub: z.string(),
  username: z.string(),
});

export type UserPayload = z.infer<typeof UserPayloadSchema>;
