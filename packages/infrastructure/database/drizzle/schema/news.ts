import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { idColumns } from "./shared/ids.js";
import { timestamps } from "./shared/timestamps.js";
import { users } from "./users";

export const news = mysqlTable('news', {
  ...idColumns(),
  title: varchar('Title', { length: 500 }).notNull(),
  text: varchar('Text', { length: 10000 }).notNull(),
  userId: int('User_ID')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
  ...timestamps()
});
