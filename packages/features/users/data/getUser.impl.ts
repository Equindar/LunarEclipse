import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import configuration from "packages/infrastructure/database/drizzle/config";
import * as schema from "packages/infrastructure/database/drizzle/migrations/schema";

const getUserImpl = async () => {
    const connection = await mysql.createConnection(configuration);
    const db = drizzle(connection, { schema, mode: "default" });
    return db.select().from(schema.monsters)
}
export default getUserImpl;