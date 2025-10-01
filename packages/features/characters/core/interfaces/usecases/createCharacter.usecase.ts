import Character from "../../entities/Character";

export default interface createCharacterUseCase {
    execute(subject: Character): Promise<boolean>;
}