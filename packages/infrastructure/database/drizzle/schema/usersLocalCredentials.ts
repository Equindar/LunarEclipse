import {
    int,
    mysqlTable,
    varchar,
} from "drizzle-orm/mysql-core";

import { timestamps } from "./shared/timestamps.js";
import { users } from "./users.js";

export const usersLocalCredentials = mysqlTable(
  "users_local_credentials",
  {
    userId: int("User_id")
      .primaryKey()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),

    passwordHash: varchar("Password_hash", { length: 255 }).notNull(),
    passwordAlgorithm: varchar("Password_algorithm", { length: 32 })
      .default("argon2id")
      .notNull(),

    ...timestamps(),
  },
);
