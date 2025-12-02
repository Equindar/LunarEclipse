import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import configuration from "packages/infrastructure/database/drizzle/config";
import * as schema from "packages/infrastructure/database/drizzle/migrations/schema";

export type Database = MySql2Database<typeof schema> & { $client: mysql.Connection };

const createDrizzleClient = async (): Promise<Database> => {
  const pool = mysql.createPool(configuration); // Pool statt Connection

  // Drizzle mit Pool + config-Objekt aufrufen (richtiger Overload)
  const db = drizzle(pool, { schema, mode: "default" });

  // Falls TS noch meckert, gezielt casten — aber meistens unnötig:
  return db as unknown as Database;
};

export default createDrizzleClient;
