
import {
    datetime,
    int,
    mysqlTable,
    unique,
    varchar,
} from "drizzle-orm/mysql-core";

import { idColumns } from "./shared/ids.js";
import { timestamps } from "./shared/timestamps.js";
import { users } from "./users.js";

export const authPasswordResetTokens = mysqlTable(
  "auth_password_reset_tokens",
  {
    ...idColumns(),

    userId: int("User_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),

    tokenHash: varchar("Token_hash", { length: 64 }).notNull(),

    expiresAt: datetime("Expires_at").notNull(),
    usedAt: datetime("Used_at"),

    ...timestamps(),
  },
  (table) => [
    unique("uq_auth_password_reset_tokens_uuid").on(table.uuid),
    unique("uq_auth_password_reset_tokens_hash").on(table.tokenHash),
  ],
);
