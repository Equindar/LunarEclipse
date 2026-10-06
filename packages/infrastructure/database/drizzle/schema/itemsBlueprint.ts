import { mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { idColumn } from "./shared/ids.js";
import { createdAtColumn, updatedAtColumn } from "./shared/timestamps.js";

export const itemsBlueprint = mysqlTable('items_blueprint', {
  ...idColumn(),
  name: varchar('Name', { length: 100 }).notNull(),
  status: mysqlEnum('Status', ['Draft', 'In Review', 'Active']).default('Draft').notNull(),
  ...createdAtColumn(),
  ...updatedAtColumn(),
});
