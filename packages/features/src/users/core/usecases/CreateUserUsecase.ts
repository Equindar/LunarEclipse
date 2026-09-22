import type { UserID } from '../value-objects/UserID.js';
import type { Email } from '../value-objects/Email.js';

export interface CreateUserInput {
  readonly displayName: string;
  readonly email: string;
}

export interface CreateUserOutput {
  readonly uuid: UserID;
  readonly displayName: string;
  readonly email: Email;
  readonly createdAt: Date;
}

export interface CreateUserUseCase {
  execute(input: CreateUserInput): Promise<CreateUserOutput>;
}
