import dotenv from 'dotenv';
import { envSchema } from './validations/env.schema';

dotenv.config();

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment configuration:');

  for (const issue of result.error.issues) {
    console.error(
      `- ${issue.path.join('.')}: ${issue.message}`
    );
  }

  process.exit(1);
}

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
