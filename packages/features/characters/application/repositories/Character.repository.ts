import Character from "@features/characters/core/entities/Character";
import { CharacterRepository } from "@features/characters/core/interfaces/repositories/Character.repository";
import { CharacterDataSource } from "@features/characters/data/interfaces/character.datasource";

export default class CharacterRepositoryImpl implements CharacterRepository {
    dataSource: CharacterDataSource

    constructor(characterDataSource: CharacterDataSource) {
        this.dataSource = characterDataSource
    }

    create(subject: Character): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    list(): Promise<Character[]> {
        throw new Error("Method not implemented.");
    }
    async get(id: number): Promise<Character | null> {
        const data = await this.dataSource.get(id);
        return data;
    }
    update(subject: Character): Promise<Character> {
        throw new Error("Method not implemented.");
    }
}