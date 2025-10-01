import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import configuration from "packages/infrastructure/database/drizzle/config";
import * as schema from "packages/infrastructure/database/drizzle/migrations/schema";
import { monsters } from "packages/infrastructure/database/drizzle/migrations/schema";

const getMonsterImpl = async (id: number) => {
    const connection = await mysql.createConnection(configuration);
    const db = drizzle(connection, { schema, mode: "default" });
    return db.select().from(monsters).where(eq(schema.monsters.id, id))
}
export default getMonsterImpl;