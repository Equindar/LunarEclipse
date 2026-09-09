import Character from "@lunareclipse/features/src/characters/core/entities/Character";

export interface CharacterDataSource {
  create(character: Character, userId: number): Promise<void>;
  get(id: number): Promise<Character | null>;
  getAll(): Promise<Character[]>;
  delete(id: number): Promise<void>;
  update(id: number, data: Character): Promise<boolean>;
}
