import dotenv from 'dotenv';
import { MissingConfigurationError } from './shared/errors/MissingConfigurationError';

// --- Init
dotenv.config();

type RequiredEnvVar = 'PORT';

function requireEnv(keys: RequiredEnvVar[]): void {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new MissingConfigurationError(`missing env-variables: ${missing.join(', ')}`);
  }
}
try {
  requireEnv(['PORT']);
}
catch (error) {
  if (error instanceof MissingConfigurationError) {
    console.error(error.message);
  } else {
    console.error('Unexpected error:', error);
  }
  process.exit(1);
}

const { SERVICE_NAME, PORT } = process.env;
const { LOG_LEVEL, LOG_DIRECTORY } = process.env;

const configuration = {
  app: {
    name: SERVICE_NAME,
    port: parseInt(PORT!, 10) || 3003,
  },
  logging: {
    level: LOG_LEVEL,
    directory: LOG_DIRECTORY,
  },
};

export default configuration;
