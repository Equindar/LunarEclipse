import { User } from '../core/user';

export interface getUserUseCase {
  execute(): Promise<User>;
}
