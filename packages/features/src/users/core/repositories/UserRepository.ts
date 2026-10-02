import { User } from '../entities/User';
import type { UserID } from '../value-objects/UserID';

export interface UserRepository {
  create(subject: User): Promise<boolean>;
  list(): Promise<User[]>;
  getById(id: number): Promise<User | null>;
  getByUuid(uuid: UserID): Promise<User | null>;
  update(subject: User): Promise<User>;
}
