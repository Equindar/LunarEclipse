import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { database } from "../config";
import mysql from "mysql2/promise";
  
const poolConnection = mysql.createPool({
  host: database.host,
  user: database.user,
  database: database.name,
});
export const db = drizzle({ client: poolConnection });