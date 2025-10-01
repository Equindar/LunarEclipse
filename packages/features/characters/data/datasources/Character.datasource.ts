import Character from "@features/characters/core/entities/Character";
import { CharacterDataSource } from "../interfaces/character.datasource";
import { MySql2Database } from "drizzle-orm/mysql2";
import { users } from "@infrastructure/database/drizzle/migrations/schema";

export class CharacterDataSourceImpl implements CharacterDataSource {
    private database: MySql2Database;

    constructor(database: MySql2Database) {
        this.database = database;
    }

    async create(character: Character): Promise<void> {
        await this.database.insert(users).values({ id: 666, nickname: character.name });
        return;
    }
    get(id: string): Promise<Character> | null {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<Character[]> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(id: string, data: Character): Promise<void> {
        throw new Error("Method not implemented.");
    }

}