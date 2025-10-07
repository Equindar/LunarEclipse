import { relations } from "drizzle-orm/relations";
import { users, characters, charactersInventory, inventories, items, charactersWallet, itemsBlueprint, itemsRarity, itemsBlueprintVersion, itemsVersion, monstersBlueprint, monsters, monstersBlueprintVersion, monstersVersion } from "./schema";

export const charactersRelations = relations(characters, ({one, many}) => ({
	user: one(users, {
		fields: [characters.userId],
		references: [users.id]
	}),
	charactersInventories: many(charactersInventory),
	charactersWallets: many(charactersWallet),
}));

export const usersRelations = relations(users, ({many}) => ({
	characters: many(characters),
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
	item: one(items, {
		fields: [charactersInventory.itemId],
		references: [items.id]
	}),
}));

export const inventoriesRelations = relations(inventories, ({many}) => ({
	charactersInventories: many(charactersInventory),
}));

export const itemsRelations = relations(items, ({one, many}) => ({
	charactersInventories: many(charactersInventory),
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

export const charactersWalletRelations = relations(charactersWallet, ({one}) => ({
	character: one(characters, {
		fields: [charactersWallet.characterId],
		references: [characters.id]
	}),
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

export const itemsVersionRelations = relations(itemsVersion, ({one}) => ({
	item: one(items, {
		fields: [itemsVersion.itemId],
		references: [items.id]
	}),
	itemsBlueprintVersion: one(itemsBlueprintVersion, {
		fields: [itemsVersion.blueprintVersionId],
		references: [itemsBlueprintVersion.id]
	}),
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