import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv';

// --- Init
dotenv.config();
const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
  throw new Error('Missing enviroment variables');
}

export default defineConfig({
  schema: "./infrastructure/database/drizzle/migrations/schema.ts",
  out: "./infrastructure/database/drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME
  },
  verbose: true,
  strict: true
});