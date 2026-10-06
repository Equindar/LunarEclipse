import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/mysql-core";

export const createdAtColumn = () => ({
  createdAt: timestamp("CreatedAt", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
});

export const updatedAtColumn = () => ({
  updatedAt: timestamp("UpdatedAt", { mode: "string" }).default(sql`NULL`).onUpdateNow(),
});

export const deletedAtColumn = () => ({
  deletedAt: timestamp("DeletedAt", { mode: "string" }).default(sql`NULL`),
});

// Kombination für den Standardfall
export const timestamps = () => ({
  ...createdAtColumn(),
  ...updatedAtColumn(),
  ...deletedAtColumn(),
});
