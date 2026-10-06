import { foreignKey, index, int, longtext, mysqlTable } from "drizzle-orm/mysql-core";
import { monsters } from "./monsters";
import { monstersBlueprintVersion } from "./monstersBlueprintVersion";
import { idColumn } from "./shared/ids.js";
import { createdAtColumn } from "./shared/timestamps.js";

export const monstersVersion = mysqlTable(
  'monsters_version',
  {
    ...idColumn(),
    monsterId: int('Monster_ID').notNull(),
    version: int('Version').notNull(),
    blueprintVersionId: int('Blueprint_Version_ID').notNull(),
    attributes: longtext('Attributes').default('NULL'),
    ...createdAtColumn(),
  },
  (table) => [
    foreignKey({
      columns: [table.blueprintVersionId],
      foreignColumns: [monstersBlueprintVersion.id],
      name: "fk_monsters_version_monsters_BP_version",
    })
      .onDelete("restrict")
      .onUpdate("restrict"),
    foreignKey({
      columns: [table.monsterId],
      foreignColumns: [monsters.id],
      name: "fk_monsters_version_monsters",
    })
      .onDelete("restrict")
      .onUpdate("restrict"),
    index('Monster_ID').on(table.monsterId),
    index('Blueprint_Version_ID').on(table.blueprintVersionId),
    // check('Attributes', sql`json_valid(\`Attributes\`)`),
  ],
);
