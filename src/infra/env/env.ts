import { z as zod } from 'zod';

export const envSchema = zod.object({
  DATABASE_URL: zod.string().url(),
  JWT_PRIVATE_KEY: zod.string(),
  JWT_PUBLIC_KEY: zod.string(),
  CLOUDFLARE_ACCOUNT_ID: zod.string(),
  AWS_BUCKET_NAME: zod.string(),
  AWS_ACCESS_KEY_ID: zod.string(),
  AWS_SECRET_ACCESS_KEY: zod.string(),
  REDIS_HOST: zod.string().optional().default('127.0.0.1'),
  REDIS_PORT: zod.coerce.number().optional().default(6379),
  REDIS_DB: zod.coerce.number().optional().default(0),
  PORT: zod.coerce.number().optional().default(3333),
});

export type Env = zod.infer<typeof envSchema>;
