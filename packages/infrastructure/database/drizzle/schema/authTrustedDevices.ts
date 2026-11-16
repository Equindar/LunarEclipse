
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

export const authTrustedDevices = mysqlTable(
  "auth_trusted_devices",
  {
    ...idColumns(),

    userId: int("User_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),

    deviceTokenHash: varchar("Device_token_hash", { length: 64 }).notNull(),

    deviceName: varchar("Device_name", { length: 255 }),
    userAgent: varchar("User_agent", { length: 512 }),

    lastIpAddress: varchar("Last_ip_address", { length: 45 }),

    expiresAt: datetime("Expires_at"),
    revokedAt: datetime("Revoked_at"),

    ...timestamps(),
  },
  (table) => [
    unique("uq_auth_trusted_devices_uuid").on(table.uuid),
    unique("uq_auth_trusted_devices_token_hash")
      .on(table.deviceTokenHash),
  ],
);
