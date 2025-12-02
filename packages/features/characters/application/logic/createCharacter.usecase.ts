import createCharacterUseCase from "@features/characters/core/interfaces/usecases/createCharacter.usecase"
import { UserRepository } from "@features/users/core/interfaces/repositories/User.repository"
import CharacterRepository from "../repositories/Character.repository"
import Character from "@features/characters/core/entities/Character"


export default class createCharacter implements createCharacterUseCase {
  characterRepository: CharacterRepository

  constructor(repository: CharacterRepository) {
    this.characterRepository = repository
  }

  execute(subject: Character, userId: number): Promise<boolean> {
    return this.characterRepository.create(subject, userId);
  }

}
