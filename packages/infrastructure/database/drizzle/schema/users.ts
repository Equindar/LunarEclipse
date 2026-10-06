import { AnyMySqlColumn, int, mysqlTable, tinyint, unique, varchar } from "drizzle-orm/mysql-core";
import { accounts } from "./accounts.js";
import { idColumns } from "./shared/ids.js";
import { timestamps } from "./shared/timestamps.js";


export const users = mysqlTable("users", {
  ...idColumns(),
  accountId: int('Account_id').notNull()
    .references((): AnyMySqlColumn => accounts.id, {
      onDelete: 'restrict',
      onUpdate: 'restrict',
    }),
  email: varchar("Email", { length: 254 }).notNull(),
  emailVerified: tinyint("Email_verified").notNull(),
  displayName: varchar("DisplayName", { length: 255 }).notNull(),
  isActive: tinyint().default(0).notNull(),
  ...timestamps()
},
  (table) => [
    unique("uq_users_email").on(table.email),
    unique("uq_users_uuid").on(table.uuid),
    unique("uq_users_displayname").on(table.displayName),
  ]);
