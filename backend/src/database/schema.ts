import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, unique, int, varchar, datetime, text, longtext, float } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const characters = mysqlTable("characters", {
	id: int("ID").autoincrement().notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ).references(() => worlds.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	name: varchar("Name", { length: 30 }).notNull(),
	status: int("Status").default(0).notNull(),
	avatar: varchar("Avatar", { length: 100 }).default('NULL'),
	experience: int("Experience").default(0).notNull(),
	worldId: int("World_ID").notNull(),
	userId: int("UserID").notNull(),
	createdDate: datetime("CreatedDate", { mode: 'string'}).notNull(),
	changedDate: datetime("ChangedDate", { mode: 'string'}).default('NULL'),
},
(table) => [
	unique("characters_unique").on(table.name),
]);

export const characterTraits = mysqlTable("character_traits", {
	id: int("ID").autoincrement().notNull().references(() => characters.id, { onDelete: "restrict", onUpdate: "restrict" } ).references(() => traits.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	characterId: int("CharacterID").notNull(),
	traitId: int("TraitID").notNull(),
	value: int("Value").default(1).notNull(),
});

export const items = mysqlTable("items", {
	id: int("ID").autoincrement().notNull().references(() => rarity.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	name: varchar("Name", { length: 100 }).notNull(),
	shortDescription: varchar("ShortDescription", { length: 250 }).default('NULL'),
	description: text("Description").default('NULL'),
	value: int("Value").default(0),
	rarityId: int("RarityID").default(0).notNull(),
},
(table) => [
	unique("items_unique").on(table.name),
]);

export const monsters = mysqlTable("monsters", {
	id: int("ID").autoincrement().notNull().references(() => rarity.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	name: varchar("Name", { length: 100 }).notNull(),
	description: text("Description").default('NULL'),
	level: int("Level").default(0),
	baseHealth: int("BaseHealth").notNull(),
	physicalAttack: int("PhysicalAttack").notNull(),
	physicalDefense: int("PhysicalDefense").notNull(),
	magicalAttack: int("MagicalAttack").notNull(),
	magicalDefense: int("MagicalDefense").notNull(),
	agility: int("Agility").notNull(),
	status: int("Status").default(0).notNull(),
	version: int("Version").default(1).notNull(),
	createdDate: datetime("CreatedDate", { mode: 'string'}).notNull(),
	changedDate: datetime("ChangedDate", { mode: 'string'}).default('NULL'),
	rarityId: int("RarityID").notNull(),
},
(table) => [
	unique("monsters_unique").on(table.name),
]);

export const traits = mysqlTable("traits", {
	id: int("ID").autoincrement().notNull(),
	name: varchar("Name", { length: 100 }).notNull(),
	description: text("Description").default('NULL'),
	attributCosts: int("AttributCosts").default(3),
	charLevel: int("CharLevel").default(1).notNull(),
},
(table) => [
	unique("traits_unique").on(table.name),
]);

export const users = mysqlTable("users", {
	id: int("ID").autoincrement().notNull(),
	username: varchar("Username", { length: 32 }).notNull(),
	password: varchar("Password", { length: 64 }).notNull(),
	salt: varchar("Salt", { length: 25 }).notNull(),
	discordId: bigint("DiscordID", { mode: "number" }),
	avatar: varchar("Avatar", { length: 100 }).default('NULL'),
	createdDate: datetime("CreatedDate", { mode: 'string'}).notNull(),
	changedDate: datetime("ChangedDate", { mode: 'string'}).default('NULL'),
},
(table) => [
	unique("Users_unique").on(table.username),
]);

export const worlds = mysqlTable("worlds", {
	id: int("ID").autoincrement().notNull(),
	name: varchar("Name", { length: 100 }).notNull(),
	playerLimit: int("PlayerLimit").default(0),
	description: longtext("Description").default('NULL'),
	startDate: datetime("StartDate", { mode: 'string'}).default('NULL'),
	endDate: datetime("EndDate", { mode: 'string'}).default('NULL'),
},
(table) => [
	unique("worlds_unique").on(table.name),
]);

export const rarity = mysqlTable("_rarity", {
	id: int("ID").autoincrement().notNull(),
	name: varchar("Name", { length: 100 }).notNull(),
	probability: float("Probability").notNull(),
	maximum: float("Maximum"),
},
(table) => [
	unique("_rarity_unique").on(table.name),
]);
