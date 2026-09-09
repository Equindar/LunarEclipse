import { ulid } from 'ulid';
import { User } from '../../core/entities/User.js';

export interface CreateUserInput {
  name: string;
  email: string;
}

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: CreateUserInput): Promise<User> {
    const user = User.create({ uuid: ulid(), name: input.name, email: input.email });

    const created = await this.userRepository.create(user);
    if (!created) {
      throw new Error('User could not be created');
    }
    return user;
  }
}
