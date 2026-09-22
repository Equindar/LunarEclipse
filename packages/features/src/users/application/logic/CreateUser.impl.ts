import { User } from '../../core/entities/User.js';
import type { CreateUserUseCase, CreateUserInput, CreateUserOutput } from '../../core/usecases/CreateUserUsecase.js';
import { UserRepository } from '../../core/repositories/UserRepository.js';
import { Uuid7UserIDGenerator } from '@lunareclipse/utilities';
import { asEmail } from '../../core/value-objects/Email.js';


export class CreateUser implements CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly idGenerator: Uuid7UserIDGenerator = new Uuid7UserIDGenerator()
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
