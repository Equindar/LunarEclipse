import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import configDatabase from './config';
  
const poolConnection = mysql.createPool({
  host: configDatabase.host,
  user: configDatabase.user,
  database: configDatabase.name,
  password: configDatabase.password
});

const db = drizzle({ client: poolConnection });

export default db;