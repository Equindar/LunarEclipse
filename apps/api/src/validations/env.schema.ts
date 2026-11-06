import { z } from 'zod';

export const envSchema = z.object({
  // Application
  SERVICE_NAME: z.string().default('Api Service'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3003),

  // Logging
  LOG_LEVEL: z.enum([
    'error',
    'warn',
    'info',
    'http',
    'verbose',
    'debug',
    'silly',
  ]).default('info'),

  LOG_DIRECTORY: z.string().default('./logs'),

  // Database
  DATABASE_HOST: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),

  // Authentication
  AUTH_SECRET: z.string().min(32),
  AUTH_ALGORITHM: z.enum([
    'ES256',
    'ES384',
    'ES512',
    'EdDSA',
    'HS256',
    'HS384',
    'HS512',
    'PS256',
    'PS384',
    'PS512',
    'RS256',
    'RS384',
    'RS512',
  ]).default('HS256'),
});

export type Env = z.infer<typeof envSchema>;
