import { User } from "@features/users/core/entities/user"
import { UserRepository } from "@features/users/core/interfaces/repositories/User.repository"
import listUsersUseCase from "@features/users/core/interfaces/usecases/listUsers.usecase";


export default class listUsers implements listUsersUseCase {
    userRepository: UserRepository

    constructor(repository: UserRepository) {
        this.userRepository = repository
    }
    async execute(): Promise<User[]> {
        const result = await this.userRepository.list();
        return result;
    }


}