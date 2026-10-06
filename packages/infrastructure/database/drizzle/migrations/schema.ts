import { sql } from "drizzle-orm";
import { bigint, binary, int, mysqlTable, text, timestamp, tinyint, unique, varchar } from "drizzle-orm/mysql-core";

export const newsTest234 = mysqlTable("news_test234", {
  id: int("ID").notNull(),
  title: varchar("Title", { length: 500 }).notNull(),
  text: varchar("Text", { length: 10000 }).notNull(),
  createdAt: timestamp("CreatedAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
  modifiedAt: timestamp("ModifiedAt", { mode: 'string' }),
  deletedAt: timestamp("DeletedAt", { mode: 'string' }),
});

export const users = mysqlTable("users", {
  id: int("ID").autoincrement().notNull(),
  uuId: binary({ length: 16 }).notNull(),
  email: varchar("Email", { length: 254 }).notNull(),
  emailVerified: tinyint("Email_verified").default(0).notNull(),
  displayName: varchar("DisplayName", { length: 255 }),
  isActive: tinyint().default(1).notNull(),
  createdAt: timestamp("CreatedAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("UpdatedAt", { mode: 'string' }),
  deletedAt: timestamp("DeletedAt", { mode: 'string' }),
},
  (table) => [
    unique("uq_users_email").on(table.email),
    unique("uq_users_uuid").on(table.uuId),
  ]);

export const drizzleJournal = mysqlTable("_drizzle_journal", {
  id: bigint({ mode: "number" }).autoincrement().notNull(),
  hash: text().notNull(),
  createdAt: bigint("created_at", { mode: "number" }),
});
