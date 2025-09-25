import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  int,
  varchar,
  unique,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const items = mysqlTable('items', {
  id: int('ID').notNull(),
  name: varchar('Name', { length: 100 }).default('NULL'),
  value: int('Value').default('NULL'),
});

export const monsters = mysqlTable(
  'monsters',
  {
    id: int('ID').autoincrement().notNull(),
    name: varchar('Name', { length: 100 }).notNull(),
  },
  (table) => [unique('monsters_unique').on(table.name)],
);

export const test = mysqlTable('test', {
  id: int().autoincrement().notNull(),
  name: varchar({ length: 50 }).notNull(),
});

export const users = mysqlTable(
  'users',
  {
    id: int('ID').notNull(),
    nickname: varchar('Nickname', { length: 100 }).notNull(),
  },
  (table) => [unique('users_unique').on(table.nickname)],
);
