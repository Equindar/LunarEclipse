
import {
    int,
    mysqlTable,
    varchar,
} from "drizzle-orm/mysql-core";

import { authTrustedDevices } from "./authTrustedDevices.js";
import { idColumns } from "./shared/ids.js";
import { timestamps } from "./shared/timestamps.js";
import { users } from "./users.js";

export const authLoginActivities = mysqlTable(
  "auth_login_activities",
  {
    ...idColumns(),

    userId: int("User_id")
      .references(() => users.id, {
        onDelete: "set null",
        onUpdate: "restrict",
      }),

    deviceId: int("Device_id")
      .references(() => authTrustedDevices.id, {
        onDelete: "set null",
        onUpdate: "restrict",
      }),

    attemptedEmail: varchar("Attempted_email", { length: 254 }),

    status: varchar("Status", { length: 32 }).notNull(),
    authMethod: varchar("Auth_method", { length: 32 }).notNull(),

    ipAddress: varchar("Ip_address", { length: 45 }),
    userAgent: varchar("User_agent", { length: 512 }),

    ...timestamps(),
  },
);
