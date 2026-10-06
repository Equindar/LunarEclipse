import type { UserID } from '../value-objects/UserID';
import type { Email } from '../value-objects/Email';

export interface GetUserInput {
  readonly uuid: UserID;
}

export interface GetUserOutput {
  readonly uuid: UserID;
  /// AnzeigeName
  readonly displayName: string;
  readonly email: Email;
  readonly createdAt: Date;
}

export interface GetUserUseCase {
  execute(input: GetUserInput): Promise<GetUserOutput | null>;
}
