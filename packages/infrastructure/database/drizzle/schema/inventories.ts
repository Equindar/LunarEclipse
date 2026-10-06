import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { idColumn } from "./shared/ids.js";

export const inventories = mysqlTable('inventories', {
  ...idColumn(),
  name: varchar('Name', { length: 100 }).notNull(),
});
