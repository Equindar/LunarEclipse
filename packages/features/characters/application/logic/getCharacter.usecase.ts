import Character from "@features/characters/core/entities/Character";
import getCharacterUseCase from "@features/characters/core/interfaces/usecases/getCharacter.usecase";
import CharacterRepository from "../repositories/Character.repository";

/**
 * Implementation of the getCharacter UseCase (Location: ApplicationLayer)
 *
 * Path: packages\features\characters\application\logic
 */
export default class getCharacter implements getCharacterUseCase {
  characterRepository: CharacterRepository
  constructor(repository: CharacterRepository) {
    this.characterRepository = repository
  }

  /**
   * UseCase: getCharacter by ID
   * @param id ID of the Character
   * @returns Character Object
   */
  async execute(id: number): Promise<Character | null> {
    const result = await this.characterRepository.get(id);
    return result;
  }
}
