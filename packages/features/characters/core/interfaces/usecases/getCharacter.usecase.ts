import Character from "../../entities/Character";

export default interface getCharacterUseCase {
    execute(id: number): Promise<Character>;
}