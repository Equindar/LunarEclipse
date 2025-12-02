import { User } from "@features/users/core/entities/User"
import { UserRepository } from "@features/users/core/interfaces/repositories/User.repository"
import createUserUseCase from "@features/users/core/interfaces/usecases/createUser.usecase"


export default class createUser implements createUserUseCase {
    userRepository: UserRepository

    constructor(repository: UserRepository) {
        this.userRepository = repository
    }

    execute(subject: User): Promise<boolean> {
        return this.userRepository.create(subject);
    }

}
