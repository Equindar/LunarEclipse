import { configDotenv } from 'dotenv';
configDotenv({ path: `.env.${process.env.NODE_ENV}` });

import { database } from "./src/config";
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/database/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: database.url,
    host: 'localhost',
    port: 3306,
    user: "sysadmin",
    password: "dresden",
    database: "lunareclipse"
  },
});
