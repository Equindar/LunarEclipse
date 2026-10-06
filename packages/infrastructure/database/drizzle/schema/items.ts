import { index, int, longtext, mysqlTable, unique } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm/sql/sql";
import { itemsBlueprint } from "./itemsBlueprint.js";
import { itemsRarity } from "./itemsRarity.js";
import { idColumns } from "./shared/ids.js";
import { createdAtColumn } from "./shared/timestamps.js";

export const items = mysqlTable(
  'items',
  {
    ...idColumns(),
    blueprintId: int('Blueprint_ID')
      .notNull()
      .references(() => itemsBlueprint.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    rarityId: int('Rarity_ID')
      .notNull()
      .references(() => itemsRarity.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    version: int('Version').notNull(),
    attributes: longtext('Attributes').default(sql`NULL`),
    ...createdAtColumn(),
  },
  (table) => [
    index('Blueprint_ID').on(table.blueprintId),
    index('Rarity_ID').on(table.rarityId),
    unique('items_uuid').on(table.uuid),
    // check('Attributes', sql`json_valid(\`Attributes\`)`),
  ],
);
