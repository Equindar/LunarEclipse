import {
    datetime,
    int,
    mysqlTable,
    unique
} from "drizzle-orm/mysql-core";

import { authTrustedDevices } from "./authTrustedDevices.js";
import { idColumns } from "./shared/ids.js";
import { timestamps } from "./shared/timestamps.js";
import { users } from "./users.js";

export const authSessions = mysqlTable(
  "auth_sessions",
  {
    ...idColumns(),

    userId: int("User_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),

    deviceId: int("Device_id")
      .references(() => authTrustedDevices.id, {
        onDelete: "set null",
        onUpdate: "restrict",
      }),
    expiresAt: datetime("Expires_at").notNull(),
    lastUsedAt: datetime("Last_used_at"),
    revokedAt: datetime("Revoked_at"),

    ...timestamps(),
  },
  (table) => [
    unique("uq_auth_sessions_uuid").on(table.uuid),
  ],
);
