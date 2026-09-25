import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql, { ConnectionOptions } from 'mysql2/promise';
import configuration from '../src/config';
import { MigrationConfig } from 'drizzle-orm/migrator';

const connectionOptions: ConnectionOptions = {
  user: configuration.database.user,
  password: configuration.database.password,
  host: configuration.database.host,
  database: configuration.database.name
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: './drizzle/migrations'
}

const main = async () => {
  const connection = await mysql.createConnection(connectionOptions);

  await migrate(drizzle({ client: connection }), migrationConfig);
  console.log('Migration successful');
  await connection.end();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
