import Character from "../../entities/Character";

export interface CharacterRepository {
  create(subject: Character, userId: number): Promise<boolean>;
  list(): Promise<Character[]>;
  get(id: number): Promise<Character | null>;
  update(id: number, subject: Character): Promise<boolean>;
}
