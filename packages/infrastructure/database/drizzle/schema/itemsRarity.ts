import { mysqlTable, unique, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm/sql/sql";
import { idColumn } from "./shared/ids.js";

export const itemsRarity = mysqlTable(
  'items_rarity',
  {
    ...idColumn(),
    name: varchar('Name', { length: 20 }).default(sql`NULL`),
  },
  (table) => [unique('Name').on(table.name)],
);
