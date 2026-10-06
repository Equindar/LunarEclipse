import { index, int, longtext, mysqlTable, text } from "drizzle-orm/mysql-core";
import { itemsBlueprint } from "./itemsBlueprint.js";
import { idColumn } from "./shared/ids.js";
import { createdAtColumn } from "./shared/timestamps.js";

export const itemsBlueprintVersion = mysqlTable(
  'items_blueprint_version',
  {
    ...idColumn(),
    blueprintId: int('Blueprint_ID')
      .notNull()
      .references(() => itemsBlueprint.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    version: int('Version').notNull(),
    attributes: longtext('Attributes').default('NULL'),
    notes: text('Notes').default('NULL'),
    ...createdAtColumn(),
  },
  (table) => [
    index('Blueprint_ID').on(table.blueprintId),
    // check('Attributes', sql`json_valid(\`Attributes\`)`),
  ],
);
