
import {
    datetime,
    int,
    mysqlTable,
    unique,
    varchar,
} from "drizzle-orm/mysql-core";

import { authSessions } from "./authSessions.js";
import { idColumns } from "./shared/ids.js";
import { timestamps } from "./shared/timestamps.js";

export const authSessionTokens = mysqlTable(
  "auth_session_tokens",
  {
    ...idColumns(),

    sessionId: int("Session_id")
      .notNull()
      .references(() => authSessions.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),

    tokenHash: varchar("Token_hash", { length: 64 }).notNull(),

    expiresAt: datetime("Expires_at").notNull(),
    consumedAt: datetime("Consumed_at"),
    revokedAt: datetime("Revoked_at"),

    ...timestamps(),
  },
  (table) => [
    unique("uq_auth_session_tokens_uuid").on(table.uuid),
    unique("uq_auth_session_tokens_hash").on(table.tokenHash),
  ],
);
