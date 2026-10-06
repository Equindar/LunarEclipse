import { index, int, mysqlTable } from "drizzle-orm/mysql-core";
import { characters } from "./characters";
import { inventories } from "./inventories";
import { itemsVersion } from "./itemsVersion";
import { idColumn } from "./shared/ids";

export const charactersInventory = mysqlTable(
  'characters_inventory',
  {
    ...idColumn(),
    itemVersionId: int('Item_Version_ID').notNull()
      .references(() => itemsVersion.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    characterId: int('Character_ID')
      .notNull()
      .references(() => characters.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    inventoryId: int('Inventory_ID')
      .notNull()
      .references(() => inventories.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    amount: int('Amount').notNull().default(1),
  },
  (table) => [
    index('Item_ID').on(table.itemVersionId),
    index('Character_ID').on(table.characterId),
    index('characters_inventory_Inventory_ID_IDX').on(table.inventoryId),
  ],
);
