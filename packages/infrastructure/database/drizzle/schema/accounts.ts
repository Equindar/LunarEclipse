import { AnyMySqlColumn, int, mysqlTable, unique } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm/sql/sql";
import { idColumns } from "./shared/ids.js";
import { timestamps } from "./shared/timestamps.js";
import { users } from "./users.js";

export const accounts = mysqlTable('accounts', {
  ...idColumns(),
  owner: int('Owner').default(sql`NULL`).references((): AnyMySqlColumn => users.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
  ...timestamps()
},
  (table) => [
    unique('accounts_uuid').on(table.uuid),
    unique('accounts_owner_unique').on(table.owner),
  ],
);
