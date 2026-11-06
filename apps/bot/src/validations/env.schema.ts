
import { z } from 'zod';

const discordTokenRegex = /^[A-Za-z0-9\-_]{24,26}\.[A-Za-z0-9\-_]{6}\.[A-Za-z0-9\-_]{27,38}$/;

const snowflakeSchema = z.string()
  .regex(/^\d{17,20}$/, { message: 'Ungültige Discord-ID' });
const discordTokenSchema = z.string().trim()
  .regex(discordTokenRegex, { message: 'Ungültiges Discord-Token-Format'  });

export const envSchema = z.object({
  // --- Application
  NODE_ENV: z.enum(['development', 'production', 'test'])
    .default('development'),

  SERVICE_NAME: z.string().min(1).default('DiscordBot'),

  // --- Discord
  DISCORD_TOKEN: discordTokenSchema,
  DISCORD_CLIENT_ID: snowflakeSchema,
  DISCORD_SERVER_ID: snowflakeSchema.optional(),

  ERROR_CHANNEL_ID: snowflakeSchema.optional(),
  STATUS_CHANNEL_ID: snowflakeSchema.optional(),
  STATUS_MESSAGE_ID: snowflakeSchema.optional(),

  // --- API
  SERVER_STATUS_API_ENDPOINT: z.url().optional(),

  // --- Logging
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

  // --- Integrations
  GITHUB_PAT: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-transcribe'),
});

export type Env = z.infer<typeof envSchema>;
