import { index, int, longtext, mysqlTable, text } from "drizzle-orm/mysql-core";
import { monstersBlueprint } from "./monstersBlueprint";
import { idColumn } from "./shared/ids.js";
import { createdAtColumn } from "./shared/timestamps.js";

export const monstersBlueprintVersion = mysqlTable(
  'monsters_blueprint_version',
  {
    ...idColumn(),
    blueprintId: int('Blueprint_ID')
      .notNull()
      .references(() => monstersBlueprint.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
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
