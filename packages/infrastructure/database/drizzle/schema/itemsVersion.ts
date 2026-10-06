import { index, int, longtext, mysqlTable } from "drizzle-orm/mysql-core";
import { items } from "./items";
import { itemsBlueprintVersion } from "./itemsBlueprintVersion";
import { idColumn } from "./shared/ids.js";
import { createdAtColumn } from "./shared/timestamps.js";

export const itemsVersion = mysqlTable(
  'items_version',
  {
    ...idColumn(),
    itemId: int('Item_ID')
      .notNull()
      .references(() => items.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    blueprintVersionId: int('Blueprint_Version_ID')
      .notNull()
      .references(() => itemsBlueprintVersion.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    version: int('Version').notNull(),
    attributes: longtext('Attributes').default('NULL'),
    ...createdAtColumn(),
  },
  (table) => [
    index('Item_ID').on(table.itemId),
    index('Blueprint_Version_ID').on(table.blueprintVersionId),
    // check('Attributes', sql`json_valid(\`Attributes\`)`),
  ],
);
