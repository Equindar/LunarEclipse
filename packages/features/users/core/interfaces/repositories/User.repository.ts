import { ULID } from "ulid";
import { User } from "../../entities/User";

export interface UserRepository {
  create(subject: User): Promise<boolean>;
  list(): Promise<User[]>;
  getById(id: number): Promise<User | null>;
  getByUuid(uuid: ULID): Promise<User | null>;
  update(subject: User): Promise<User>;
}
