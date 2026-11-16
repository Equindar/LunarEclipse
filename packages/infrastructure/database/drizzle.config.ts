import { type Config, defineConfig } from 'drizzle-kit';
import configuration from './src/config/config.js';

const config: Config = {
  schema: './drizzle/schema',
  out: './drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: configuration.database.host,
    port: 3306,
    user: configuration.database.user,
    password: configuration.database.password,
    database: configuration.database.name,
  },
  migrations: {
    table: '_drizzle_journal'
  },
  verbose: true,
  strict: true,
}

export default defineConfig(config);
