import Character from "@features/characters/core/entities/Character";
import { CharacterDataSource } from "../interfaces/character.datasource";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { characters } from "@infrastructure/database/drizzle/migrations/schema";
import { User } from "@features/users/core/entities/user";

export class CharacterDataSourceImpl implements CharacterDataSource {
    private database: MySql2Database;

    constructor(database: MySql2Database) {
        this.database = database;
    }

    async create(character: Character): Promise<void> {
        const char = new Character({ name: "Equindar", experience: 0 }, new User(character.owner.name, character.owner.uuid))
        await this.database.insert(characters).values(
            {
                name: char.name,
                experience: char.experience
            }
        );
        return;
    }

    async get(id: number): Promise<Character | null> {
        const data = await this.database.select().from(characters).where(eq(characters.id, id))
        return data;
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