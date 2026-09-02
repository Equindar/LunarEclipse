import dotenv from 'dotenv';
import { MissingConfigurationError } from './errors/MissingConfigurationError.js';

type Server = {
  id: string;
  name: string;
};

// --- Init
dotenv.config();

type RequiredEnvVar = 'DISCORD_TOKEN' | 'DISCORD_CLIENT_ID';

function requireEnv(keys: RequiredEnvVar[]): void {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new MissingConfigurationError(`Fehlende Environment-Variablen: ${missing.join(', ')}`);
  }
}

requireEnv(['DISCORD_TOKEN', 'DISCORD_CLIENT_ID']);

const { SERVICE_NAME } = process.env;
const { DISCORD_CLIENT_ID, DISCORD_TOKEN, DISCORD_SERVER_ID } = process.env;
const { LOG_LEVEL, LOG_DIRECTORY } = process.env;
const { OPENAI_API_KEY, OPENAI_MODEL } = process.env;

const configuration = {
  app: {
    name: SERVICE_NAME,
    clientId: DISCORD_CLIENT_ID || '',
    secret: DISCORD_TOKEN || '',
  },
  notifiers: {
    discord: {
      channelId: process.env.ERROR_CHANNEL_ID || '',
    },
  },
  servers: [DISCORD_SERVER_ID],
  logging: {
    level: LOG_LEVEL,
    directory: LOG_DIRECTORY,
  },
  integrations: {
    openai: {
      key: OPENAI_API_KEY,
      model: OPENAI_MODEL || '',
    },
  },
};

export default configuration;
