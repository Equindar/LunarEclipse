import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator"
import mysql from 'mysql2/promise';
import configDatabase from './config';

// Create the connection to database
const connection = mysql.createPool({
  host: configDatabase.host,
  user: configDatabase.user,
  database: configDatabase.name,
  password: configDatabase.password
});

const db = drizzle({client: connection});

console.log(db);

const migrationOptions = {
	migrationsFolder: './drizzle',
};

const main = async () => {
    try {
        await migrate(db, migrationOptions);
    }
    catch(error) {
      console.log(error);
      process.exit(1);
    }
}