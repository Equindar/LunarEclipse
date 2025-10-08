import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import configuration from "packages/infrastructure/database/drizzle/config";
import * as schema from "packages/infrastructure/database/drizzle/migrations/schema";

export type drizzleClient = ReturnType<typeof drizzle>

const drizzleClient = async () => {
    const connection = await mysql.createConnection(configuration);
    return drizzle({ client: connection, schema, mode: "default" });
}

export default drizzleClient;
