import dotenv from 'dotenv';

// --- Init
dotenv.config();

type RequiredEnvVar = 'DATABASE_HOST' | 'DATABASE_USER' | 'DATABASE_PASSWORD' | 'DATABASE_NAME';

function requireEnv(keys: RequiredEnvVar[]): void {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Fehlende Environment-Variablen: ${missing.join(', ')}`);
  }
}

try {
  requireEnv(['DATABASE_HOST', 'DATABASE_USER', 'DATABASE_PASSWORD', 'DATABASE_NAME']);
}
catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Unexpected error:', error);
  }
  process.exit(1);
}

const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

const configuration = {
  database: {
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    name: DATABASE_NAME,
  },
  app: {
    name: "Database ",
  },
  logging: {
    level: "info",
  },

};

export default configuration;
