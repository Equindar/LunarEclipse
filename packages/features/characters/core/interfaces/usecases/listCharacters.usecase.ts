import Character from "../../entities/Character";

export interface listCharactersUseCase {
  execute(): Promise<Character[]>;
}
