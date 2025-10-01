import Character from "@features/characters/core/entities/Character";
import { CharacterRepository } from "@features/characters/core/interfaces/repositories/Character.repository";

export default class CharacterRepositoryImpl implements CharacterRepository {
    create(subject: Character): Promise<boolean> {
        console.log("here");
        throw new Error("Method not implemented.");
    }
    list(): Promise<Character[]> {
        throw new Error("Method not implemented.");
    }
    get(): Promise<Character> {
        throw new Error("Method not implemented !!!.");
    }
    update(subject: Character): Promise<Character> {
        throw new Error("Method not implemented.");
    }
}