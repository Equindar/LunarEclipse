import { User } from "@features/users/core/entities/User"
import { UserRepository } from "@features/users/core/interfaces/repositories/User.repository"
import createUserUseCase from "@features/users/core/interfaces/usecases/createUser.usecase"

export interface CreateUserRequest {
  nickname: string;
}

export default class createUser implements createUserUseCase {
  userRepository: UserRepository

  constructor(repository: UserRepository) {
    this.userRepository = repository
  }

  execute(req: CreateUserRequest): Promise<boolean> {
    const user = User.register(req.nickname);
    return this.userRepository.create(user);
  }

}
