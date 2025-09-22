import { drizzle } from "drizzle-orm/mysql2";
import { test, users } from "./migrations/schema";
import mysql from "mysql2/promise";
import configuration from "./config";
import * as schema from "./migrations/schema";

const main = async () => {
    const connection = await mysql.createConnection(configuration);

    const db = drizzle(connection, { schema, mode: "default" });

    console.log("Seeding Database");
    // Clear all data
    await db.delete(test);
    await db.delete(users);

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});