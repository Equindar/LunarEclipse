import Character from "@features/characters/core/entities/Character";

export interface CharacterDataSource {
    create(character: Character): void;
    get(id: string): Promise<Character> | null;
    getAll(): Promise<Character[]>;
    delete(id: string): void;
    update(id: string, data: Character): void;
}