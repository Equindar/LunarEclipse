import Character from "@features/characters/core/entities/Character";
import { CharacterRepository } from "@features/characters/core/interfaces/repositories/Character.repository";
import { CharacterDataSource } from "@features/characters/data/interfaces/character.datasource";

export default class CharacterRepositoryImpl implements CharacterRepository {
  dataSource: CharacterDataSource

  constructor(characterDataSource: CharacterDataSource) {
    this.dataSource = characterDataSource
  }

  async create(subject: Character, userId: number): Promise<boolean> {
    await this.dataSource.create(subject, userId);
    return true;
  }

  async list(): Promise<Character[]> {
    const data = await this.dataSource.getAll();
    return data;
  }
  async get(id: number): Promise<Character | null> {
    const data = await this.dataSource.get(id);
    return data;
  }
  async update(id: number, subject: Character): Promise<boolean> {
    await this.dataSource.update(id, subject);
    return true;
  }
}
