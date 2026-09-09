import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import configuration from './config.js';
import * as schema from '../drizzle/migrations/schema.js';

export type Database = MySql2Database<typeof schema>;

export const createDatabaseConnection = (): Database => {
  const pool = mysql.createPool(configuration);

  return drizzle(pool, {
    schema,
    mode: 'default',
  });
};

export const checkDatabaseConnection = async (db: Database): Promise<void> => {
  await db.execute('SELECT 1');
}
