import Character from "@features/characters/core/entities/Character"
import { CharacterRepository } from "@features/characters/core/interfaces/repositories/Character.repository"
import { listCharactersUseCase } from "@features/characters/core/interfaces/usecases/listCharacters.usecase"


/**
 * Implementation of the getCharacters UseCase (Location: ApplicationLayer)
 *
 * Path: packages\features\characters\application\logic
 */
export class listCharacters implements listCharactersUseCase {
  characterRepository: CharacterRepository
  constructor(repository: CharacterRepository) {
    this.characterRepository = repository
  }

  /**
   * UseCase: listCharacters
   * @returns List of Character Objects
   */
  async execute(): Promise<Character[]> {
    const result = await this.characterRepository.list()
    return result
  }
}
