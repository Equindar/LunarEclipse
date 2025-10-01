import Character from "@features/characters/core/entities/Character"
import { CharacterRepository } from "@features/characters/core/interfaces/repositories/Character.repository"
import { getCharactersUseCase } from "@features/characters/core/interfaces/usecases/getCharacters.usecase"


/**
 * Implementation of the getCharacters UseCase (Location: ApplicationLayer)
 * 
 * Path: packages\features\characters\application\logic
 */
export class getCharacters implements getCharactersUseCase {
    characterRepository: CharacterRepository
    constructor(repository: CharacterRepository) {
        this.characterRepository = repository
    }

    /**
     * UseCase: getCharacters
     * @returns List of Character Objects
     */
    async execute(): Promise<Character[]> {
        const result = await this.characterRepository.list()
        return result
    }
}