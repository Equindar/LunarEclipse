import { InvalidConfigurationError } from '../errors/InValidConfigurationError';
import { envSchema } from '../validations/env.schema';

// --- Environment
const nodeEnv = process.env.NODE_ENV ?? 'development';

// --- Init
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
    port: env.PORT,
  },
  logging: {
    level: env.LOG_LEVEL,
    directory: env.LOG_DIRECTORY,
  },
  database: {
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  },
  auth: {
    secret: env.AUTH_SECRET,
    algorithm: env.AUTH_ALGORITHM,
  },
};

export default configuration;
