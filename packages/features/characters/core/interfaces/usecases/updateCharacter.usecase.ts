import Character from "../../entities/Character";

export default interface updateCharacterUseCase {
  execute(id: number, subject: Character): Promise<boolean>;
}
