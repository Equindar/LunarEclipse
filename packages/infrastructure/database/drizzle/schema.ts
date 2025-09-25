import { mysqlTable, varchar, int } from 'drizzle-orm/mysql-core';

export const test = mysqlTable('Test', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
});
