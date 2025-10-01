import Character from "../../entities/Character";

export interface getCharactersUseCase {
    execute(): Promise<Character[]>;
}