import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, unique, int, varchar, timestamp, index, check, longtext, mysqlEnum, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const characters = mysqlTable("characters", {
	id: int("ID").notNull(),
	name: varchar("Name", { length: 100 }).notNull(),
	experience: int("Experience").default(0).notNull(),
	userId: int("User_ID").notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	createdAt: timestamp("Created_At", { mode: 'string' }).default('current_timestamp()'),
},
(table) => [
	unique("characters_name_unique").on(table.name),
]);

export const charactersInventory = mysqlTable("characters_inventory", {
	id: int("ID").autoincrement().notNull(),
	itemId: int("Item_ID").notNull().references(() => items.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	characterId: int("Character_ID").notNull().references(() => characters.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	inventoryId: int("Inventory_ID").notNull().references(() => inventories.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	amount: int("Amount").notNull(),
},
(table) => [
	index("Item_ID").on(table.itemId),
	index("Character_ID").on(table.characterId),
	index("characters_inventory_Inventory_ID_IDX").on(table.inventoryId),
]);

export const charactersWallet = mysqlTable("characters_wallet", {
	id: int("ID").notNull(),
	characterId: int("Character_ID").notNull().references(() => characters.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	amount: int("Amount").notNull(),
	createdAt: timestamp("Created_At", { mode: 'string' }).default('current_timestamp()'),
	updatedAt: timestamp("Updated_At", { mode: 'string' }).default('current_timestamp()'),
},
(table) => [
	index("Character_ID").on(table.characterId),
]);

export const inventories = mysqlTable("inventories", {
	id: int("ID").autoincrement().notNull(),
	name: varchar("Name", { length: 100 }).notNull(),
});

export const items = mysqlTable("items", {
	id: int("ID").notNull(),
	blueprintId: int("Blueprint_ID").notNull().references(() => itemsBlueprint.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	rarityId: int("Rarity_ID").notNull().references(() => itemsRarity.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	version: int("Version").notNull(),
	attributes: longtext("Attributes").default('NULL'),
	createdAt: timestamp("Created_At", { mode: 'string' }).default('current_timestamp()'),
},
(table) => [
	index("Blueprint_ID").on(table.blueprintId),
	index("Rarity_ID").on(table.rarityId),
	check("Attributes", sql`json_valid(\`Attributes\`)`),
]);

export const itemsBlueprint = mysqlTable("items_blueprint", {
	id: int("ID").notNull(),
	name: varchar("Name", { length: 100 }).notNull(),
	status: mysqlEnum("Status", ['Draft','In Review','Active']).default('\'Draft\'').notNull(),
	createdAt: timestamp("Created_At", { mode: 'string' }).default('current_timestamp()'),
	updatedAt: timestamp("Updated_At", { mode: 'string' }).default('current_timestamp()'),
});

export const itemsBlueprintVersion = mysqlTable("items_blueprint_version", {
	id: int("ID").notNull(),
	blueprintId: int("Blueprint_ID").notNull().references(() => itemsBlueprint.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	version: int("Version").notNull(),
	attributes: longtext("Attributes").default('NULL'),
	notes: text("Notes").default('NULL'),
	createdAt: timestamp("Created_At", { mode: 'string' }).default('current_timestamp()'),
},
(table) => [
	index("Blueprint_ID").on(table.blueprintId),
	check("Attributes", sql`json_valid(\`Attributes\`)`),
]);

export const itemsRarity = mysqlTable("items_rarity", {
	id: int("ID").autoincrement().notNull(),
	name: varchar("Name", { length: 20 }).default('NULL'),
},
(table) => [
	unique("Name").on(table.name),
]);

export const itemsVersion = mysqlTable("items_version", {
	id: int("ID").notNull(),
	itemId: int("Item_ID").notNull().references(() => items.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	blueprintVersionId: int("Blueprint_Version_ID").notNull().references(() => itemsBlueprintVersion.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	version: int("Version").notNull(),
	attributes: longtext("Attributes").default('NULL'),
	createdAt: timestamp("Created_At", { mode: 'string' }).default('current_timestamp()'),
},
(table) => [
	index("Item_ID").on(table.itemId),
	index("Blueprint_Version_ID").on(table.blueprintVersionId),
	check("Attributes", sql`json_valid(\`Attributes\`)`),
]);

export const monsters = mysqlTable("monsters", {
	id: int("ID").notNull(),
	blueprintId: int("Blueprint_ID").notNull().references(() => monstersBlueprint.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	version: int("Version").notNull(),
	attributes: longtext("Attributes").default('NULL'),
	createdAt: timestamp("Created_At", { mode: 'string' }).default('current_timestamp()'),
},
(table) => [
	index("Blueprint_ID").on(table.blueprintId),
	check("Attributes", sql`json_valid(\`Attributes\`)`),
]);

export const monstersBlueprint = mysqlTable("monsters_blueprint", {
	id: int("ID").notNull(),
	name: varchar("Name", { length: 100 }).notNull(),
	status: mysqlEnum("Status", ['Draft','In Review','Active']).default('\'Draft\'').notNull(),
	createdAt: timestamp("Created_At", { mode: 'string' }).default('current_timestamp()'),
	updatedAt: timestamp("Updated_At", { mode: 'string' }).default('current_timestamp()'),
});

export const monstersBlueprintVersion = mysqlTable("monsters_blueprint_version", {
	id: int("ID").notNull(),
	blueprintId: int("Blueprint_ID").notNull().references(() => monstersBlueprint.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	version: int("Version").notNull(),
	attributes: longtext("Attributes").default('NULL'),
	notes: text("Notes").default('NULL'),
	createdAt: timestamp("Created_At", { mode: 'string' }).default('current_timestamp()'),
},
(table) => [
	index("Blueprint_ID").on(table.blueprintId),
	check("Attributes", sql`json_valid(\`Attributes\`)`),
]);

export const monstersVersion = mysqlTable("monsters_version", {
	id: int("ID").notNull(),
	monsterId: int("Monster_ID").notNull().references(() => monsters.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	version: int("Version").notNull(),
	blueprintVersionId: int("Blueprint_Version_ID").notNull().references(() => monstersBlueprintVersion.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	attributes: longtext("Attributes").default('NULL'),
	createdAt: timestamp("Created_At", { mode: 'string' }).default('current_timestamp()'),
},
(table) => [
	index("Monster_ID").on(table.monsterId),
	index("Blueprint_Version_ID").on(table.blueprintVersionId),
	check("Attributes", sql`json_valid(\`Attributes\`)`),
]);

export const test = mysqlTable("test", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 50 }).notNull(),
});

export const users = mysqlTable("users", {
	id: int("ID").autoincrement().notNull(),
	nickname: varchar("Nickname", { length: 100 }).notNull(),
},
(table) => [
	unique("users_unique").on(table.nickname),
]);
