import CharacterRepository from "../repositories/Character.repository"
import Character from "@features/characters/core/entities/Character"
import updateCharacterUseCase from "@features/characters/core/interfaces/usecases/updateCharacter.usecase"


export default class updateCharacter implements updateCharacterUseCase {
  characterRepository: CharacterRepository

  constructor(repository: CharacterRepository) {
    this.characterRepository = repository
  }

  async execute(id: number, subject: Character): Promise<boolean> {
    this.characterRepository.update(id, subject);
    return true;
  }

}
