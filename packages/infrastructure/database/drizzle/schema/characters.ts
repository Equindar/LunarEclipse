import { int, mysqlTable, unique, varchar } from "drizzle-orm/mysql-core";
import { idColumns } from "./shared/ids.js";
import { timestamps } from "./shared/timestamps.js";
import { users } from "./users.js";

export const characters = mysqlTable(
  'characters',
  {
    ...idColumns(),
    name: varchar('name', { length: 100 }).notNull(),
    experience: int('experience').default(0).notNull(),
    userId: int('user_ID')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    ...timestamps()
  },
  (table) => [
    unique('characters_name_unique').on(table.name),
    unique('characters_uuid').on(table.uuid),
  ],
);
