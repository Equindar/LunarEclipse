import { relations } from "drizzle-orm/relations";
import { users, accounts, characters, charactersInventory, inventories, itemsVersion, charactersWallet, itemsBlueprint, items, itemsRarity, itemsBlueprintVersion, monstersBlueprint, monsters, monstersBlueprintVersion, monstersVersion, news, usersLogins } from "./schema";

export const accountsRelations = relations(accounts, ({one, many}) => ({
	user: one(users, {
		fields: [accounts.owner],
		references: [users.id],
		relationName: "accounts_owner_users_id"
	}),
	users: many(users, {
		relationName: "users_accountId_accounts_id"
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	accounts: many(accounts, {
		relationName: "accounts_owner_users_id"
	}),
	characters: many(characters),
	news: many(news),
	account: one(accounts, {
		fields: [users.accountId],
		references: [accounts.id],
		relationName: "users_accountId_accounts_id"
	}),
	usersLogins: many(usersLogins),
}));

export const charactersRelations = relations(characters, ({one, many}) => ({
	user: one(users, {
		fields: [characters.userId],
		references: [users.id]
	}),
	charactersInventories: many(charactersInventory),
	charactersWallets: many(charactersWallet),
}));

export const charactersInventoryRelations = relations(charactersInventory, ({one}) => ({
	character: one(characters, {
		fields: [charactersInventory.characterId],
		references: [characters.id]
	}),
	inventory: one(inventories, {
		fields: [charactersInventory.inventoryId],
		references: [inventories.id]
	}),
	itemsVersion: one(itemsVersion, {
		fields: [charactersInventory.id],
		references: [itemsVersion.id]
	}),
}));

export const inventoriesRelations = relations(inventories, ({many}) => ({
	charactersInventories: many(charactersInventory),
}));

export const itemsVersionRelations = relations(itemsVersion, ({one, many}) => ({
	charactersInventories: many(charactersInventory),
	item: one(items, {
		fields: [itemsVersion.itemId],
		references: [items.id]
	}),
	itemsBlueprintVersion: one(itemsBlueprintVersion, {
		fields: [itemsVersion.blueprintVersionId],
		references: [itemsBlueprintVersion.id]
	}),
}));

export const charactersWalletRelations = relations(charactersWallet, ({one}) => ({
	character: one(characters, {
		fields: [charactersWallet.characterId],
		references: [characters.id]
	}),
}));

export const itemsRelations = relations(items, ({one, many}) => ({
	itemsBlueprint: one(itemsBlueprint, {
		fields: [items.blueprintId],
		references: [itemsBlueprint.id]
	}),
	itemsRarity: one(itemsRarity, {
		fields: [items.rarityId],
		references: [itemsRarity.id]
	}),
	itemsVersions: many(itemsVersion),
}));

export const itemsBlueprintRelations = relations(itemsBlueprint, ({many}) => ({
	items: many(items),
	itemsBlueprintVersions: many(itemsBlueprintVersion),
}));

export const itemsRarityRelations = relations(itemsRarity, ({many}) => ({
	items: many(items),
}));

export const itemsBlueprintVersionRelations = relations(itemsBlueprintVersion, ({one, many}) => ({
	itemsBlueprint: one(itemsBlueprint, {
		fields: [itemsBlueprintVersion.blueprintId],
		references: [itemsBlueprint.id]
	}),
	itemsVersions: many(itemsVersion),
}));

export const monstersRelations = relations(monsters, ({one, many}) => ({
	monstersBlueprint: one(monstersBlueprint, {
		fields: [monsters.blueprintId],
		references: [monstersBlueprint.id]
	}),
	monstersVersions: many(monstersVersion),
}));

export const monstersBlueprintRelations = relations(monstersBlueprint, ({many}) => ({
	monsters: many(monsters),
	monstersBlueprintVersions: many(monstersBlueprintVersion),
}));

export const monstersBlueprintVersionRelations = relations(monstersBlueprintVersion, ({one, many}) => ({
	monstersBlueprint: one(monstersBlueprint, {
		fields: [monstersBlueprintVersion.blueprintId],
		references: [monstersBlueprint.id]
	}),
	monstersVersions: many(monstersVersion),
}));

export const monstersVersionRelations = relations(monstersVersion, ({one}) => ({
	monster: one(monsters, {
		fields: [monstersVersion.monsterId],
		references: [monsters.id]
	}),
	monstersBlueprintVersion: one(monstersBlueprintVersion, {
		fields: [monstersVersion.blueprintVersionId],
		references: [monstersBlueprintVersion.id]
	}),
}));

export const newsRelations = relations(news, ({one}) => ({
	user: one(users, {
		fields: [news.userId],
		references: [users.id]
	}),
}));

export const usersLoginsRelations = relations(usersLogins, ({one}) => ({
	user: one(users, {
		fields: [usersLogins.userId],
		references: [users.id]
	}),
}));