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

const configuration = {
  database: {
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    name: process.env.DATABASE_NAME!,
  },
  app: {
    name: "Database ",
  },
  logging: {
    level: "info",
  },

};

export default configuration;
