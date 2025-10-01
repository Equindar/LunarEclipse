import Character from "@features/characters/core/entities/Character"
import { CharacterRepository } from "@features/characters/core/interfaces/repositories/Character.repository"
import getCharacterUseCase from "@features/characters/core/interfaces/usecases/getCharacter.usecase"

/**
 * Implementation of the getCharacter UseCase (Location: ApplicationLayer)
 * 
 * Path: packages\features\characters\application\logic
 */
export class getCharacter implements getCharacterUseCase {
    characterRepository: CharacterRepository
    constructor(repository: CharacterRepository) {
        this.characterRepository = repository
    }

    /**
     * UseCase: getCharacter by ID
     * @param id ID of the Character
     * @returns Character Object
     */
    async execute(id: number): Promise<Character> {
        const result = await this.characterRepository.get()
        return result
    }
}