import { relations } from "drizzle-orm/relations";
import { users, characters, worlds, characterTraits, traits, rarity, items, monsters } from "./schema";

export const charactersRelations = relations(characters, ({one, many}) => ({
	user: one(users, {
		fields: [characters.id],
		references: [users.id]
	}),
	world: one(worlds, {
		fields: [characters.id],
		references: [worlds.id]
	}),
	characterTraits: many(characterTraits),
}));

export const usersRelations = relations(users, ({many}) => ({
	characters: many(characters),
}));

export const worldsRelations = relations(worlds, ({many}) => ({
	characters: many(characters),
}));

export const characterTraitsRelations = relations(characterTraits, ({one}) => ({
	character: one(characters, {
		fields: [characterTraits.id],
		references: [characters.id]
	}),
	trait: one(traits, {
		fields: [characterTraits.id],
		references: [traits.id]
	}),
}));

export const traitsRelations = relations(traits, ({many}) => ({
	characterTraits: many(characterTraits),
}));

export const itemsRelations = relations(items, ({one}) => ({
	rarity: one(rarity, {
		fields: [items.id],
		references: [rarity.id]
	}),
}));

export const rarityRelations = relations(rarity, ({many}) => ({
	items: many(items),
	monsters: many(monsters),
}));

export const monstersRelations = relations(monsters, ({one}) => ({
	rarity: one(rarity, {
		fields: [monsters.id],
		references: [rarity.id]
	}),
}));