
import {
    int,
    mysqlTable,
    primaryKey,
    varchar,
} from "drizzle-orm/mysql-core";

import { accounts } from "./accounts.js";
import { timestamps } from "./shared/timestamps.js";
import { users } from "./users.js";

export const accountsMemberships = mysqlTable(
  "accounts_memberships",
  {
    accountId: int("Account_id")
      .notNull()
      .references(() => accounts.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),

    userId: int("User_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),

    role: varchar("Role", { length: 32 }).default("member").notNull(),

    ...timestamps(),
  },
  (table) => [
    primaryKey({
      name: "pk_account_memberships",
      columns: [table.accountId, table.userId],
    }),
  ],
);
