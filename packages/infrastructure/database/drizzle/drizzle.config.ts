import { configDotenv } from 'dotenv';
configDotenv({ path: `.env.development` });
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/database',
  schema: './src/database/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DB_URL as string,
  },
});
