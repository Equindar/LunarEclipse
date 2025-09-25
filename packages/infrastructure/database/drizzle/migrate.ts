import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import configuration from './config';

const main = async () => {
  const connection = await mysql.createConnection(configuration);

  await migrate(drizzle({ client: connection }), {
    migrationsFolder: './src/drizzle/migrations',
  });
  console.log('Migration successful');
  await connection.end();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
