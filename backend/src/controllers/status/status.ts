import { Request, Response } from 'express';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { configDatabase } from 'database/config';

// const connection = await mysql.createConnection({
//   host: configDatabase.host,
//   user: configDatabase.user,
//   database: configDatabase.name,
//   port: configDatabase.port,
//   password: configDatabase.password
// });

// const db = drizzle({ client: connection });

export async function getStatus(_req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");
  res.appendHeader("API-Version", "1.0")
  res.json({msg: "haha"});
  res.statusCode = 200;
};

