import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import configuration from "packages/infrastructure/database/drizzle/config";
import * as schema from "packages/infrastructure/database/drizzle/migrations/schema";

const drizzleClient = async () => {
    const connection = await mysql.createConnection(configuration);
    return drizzle(connection, { schema, mode: "default" });
}

export default drizzleClient;