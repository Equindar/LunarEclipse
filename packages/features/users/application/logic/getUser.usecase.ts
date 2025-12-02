import { User } from "@features/users/core/entities/User"
import { UserRepository } from "@features/users/core/interfaces/repositories/User.repository"
import getUserUseCase from "@features/users/core/interfaces/usecases/getUser.usecase"


export default class getUser implements getUserUseCase {
    userRepository: UserRepository

    constructor(repository: UserRepository) {
        this.userRepository = repository
    }

    async execute(id: number): Promise<User | null> {
        const result = await this.userRepository.get(id);
        return result;
    }

}
