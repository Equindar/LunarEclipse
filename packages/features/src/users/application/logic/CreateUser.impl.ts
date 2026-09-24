import { User } from '../../core/entities/User.js';
import type { UserID } from '../../core/value-objects/UserID.js';
import type { CreateUserUseCase, CreateUserInput, CreateUserOutput } from '../../core/usecases/CreateUserUsecase.js';
import { IdGenerator } from '../../core/ports/IdGenerator.js';
import { UserRepository } from '../../core/repositories/UserRepository.js';
import { asEmail } from '../../core/value-objects/Email.js';


export class CreateUser implements CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly idGenerator: IdGenerator<UserID>,
  ) { }

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const id = this.idGenerator.generate();
    const user = User.create({
      uuid: id,
      name: input.displayName,
      email: asEmail(input.email)
    });

    await this.userRepository.create(user);

    return {
      uuid: user.uuid,
      displayName: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }
}
