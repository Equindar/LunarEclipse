import { InvalidConfigurationError } from "../errors/InValidConfigurationError.js";
import { envSchema } from "../validations/env.schema.js";

// --- Environment
const nodeEnv = process.env.NODE_ENV ?? 'development';

const envFile = nodeEnv === 'development'
  ? '.env.development'
  : '.env';

try {
  process.loadEnvFile(envFile);
} catch (error) {
  if (
    !(error instanceof Error) ||
    !('code' in error && error.code === 'ENOENT')
  ) {
    throw error;
  }
}

// --- Validation
const result = envSchema.safeParse(process.env);

if (!result.success) {
  const issues = result.error.issues.map(
    (issue) => `${issue.path.join('.')}: ${issue.message}`
  );

  throw new InvalidConfigurationError(issues);
}

// --- Configuration
const env = result.data;

const configuration = {
  app: {
    name: env.SERVICE_NAME,
    clientId: env.DISCORD_CLIENT_ID,
    secret: env.DISCORD_TOKEN,
  },
  notifiers: {
    discord: {
      channelId: env.ERROR_CHANNEL_ID ?? '',
    },
  },
  servers: env.DISCORD_SERVER_ID
    ? [env.DISCORD_SERVER_ID]
    : [],
  status: {
    channelId: env.STATUS_CHANNEL_ID ?? '',
    messageId: env.STATUS_MESSAGE_ID ?? '',
    apiEndpoint: env.SERVER_STATUS_API_ENDPOINT,
  },
  logging: {
    level: env.LOG_LEVEL,
    directory: env.LOG_DIRECTORY,
  },
  integrations: {
    github: {
      token: env.GITHUB_PAT,
    },
    openai: {
      key: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL,
    },
  },
};

export default configuration;
