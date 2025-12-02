import Character from "@features/characters/core/entities/Character";

export interface CharacterDataSource {
  create(character: Character, userId: number): void;
  get(id: number): Promise<Character | null>;
  getAll(): Promise<Character[]>;
  delete(id: number): void;
  update(id: number, data: Character): void;
}
