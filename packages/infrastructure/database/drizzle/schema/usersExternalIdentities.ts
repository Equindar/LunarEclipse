
import {
    int,
    mysqlTable,
    unique,
    varchar,
} from "drizzle-orm/mysql-core";

import { idColumn } from "./shared/ids.js";
import { timestamps } from "./shared/timestamps.js";
import { users } from "./users.js";

export const usersExternalIdentities = mysqlTable(
  "users_external_identities",
  {
    ...idColumn(),

    userId: int("User_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),

    provider: varchar("Provider", { length: 32 }).notNull(),
    providerUserId: varchar("Provider_user_id", { length: 255 }).notNull(),

    emailAtProvider: varchar("Email_at_provider", { length: 254 }),

    ...timestamps(),
  },
  (table) => [
    unique("uq_users_external_provider_user")
      .on(table.provider, table.providerUserId),
  ],
);
