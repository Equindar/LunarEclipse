import Character from "../../entities/Character";

export interface CharacterRepository {
    create(subject: Character): Promise<boolean>;
    list(): Promise<Character[]>;
    get(): Promise<Character>;
    update(subject: Character): Promise<Character>;
}