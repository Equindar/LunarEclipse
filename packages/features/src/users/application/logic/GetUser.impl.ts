import type { GetUserUseCase, GetUserInput, GetUserOutput } from "../../core/usecases/GetUserUsecase";
import type { UserRepository } from '../../core/repositories/UserRepository.js';

export class GetUser implements GetUserUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) { }

  async execute(input: GetUserInput): Promise<GetUserOutput | null> {
    let result = null;
    const data = await this.userRepository.getByUuid(input.uuid);

    if (data) {
      result = {
        uuid: data.uuid,
        displayName: data.name,
        email: data.email,
        createdAt: data.createdAt
      };

    }
    return result;
  }
}
