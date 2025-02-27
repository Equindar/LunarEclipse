import 'dotenv';
import { configDatabase } from './src/database/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/database/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: configDatabase.url!
  },
});
