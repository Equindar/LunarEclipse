import { index, int, mysqlTable } from "drizzle-orm/mysql-core";
import { characters } from "./characters";
import { idColumn } from "./shared/ids.js";
import { createdAtColumn, updatedAtColumn } from "./shared/timestamps.js";

export const charactersWallet = mysqlTable(
  'characters_wallet',
  {
    ...idColumn(),
    characterId: int('Character_ID')
      .notNull()
      .references(() => characters.id, { onDelete: 'restrict', onUpdate: 'restrict' }),
    amount: int('Amount').default(0).notNull(),
    ...createdAtColumn(),
    ...updatedAtColumn(),
  },
  (table) => [index('Character_ID').on(table.characterId)],
);
