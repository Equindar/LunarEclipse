import { index, int, longtext, mysqlTable, unique } from "drizzle-orm/mysql-core";
import { monstersBlueprint } from "./monstersBlueprint.js";
import { idColumns } from "./shared/ids.js";
import { createdAtColumn } from "./shared/timestamps.js";

export const monsters = mysqlTable(
  'monsters',
  {
    ...idColumns(),
    blueprintId: int('Blueprint_ID')
      .notNull()
      .references(() => monstersBlueprint.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    version: int('Version').notNull(),
    attributes: longtext('Attributes').default('NULL'),
    ...createdAtColumn(),
  },
  (table) => [
    index('Blueprint_ID').on(table.blueprintId),
    unique('monsters_uuid').on(table.uuid),
    // check('Attributes', sql`json_valid(\`Attributes\`)`),
  ],
);
