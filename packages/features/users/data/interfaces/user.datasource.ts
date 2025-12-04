import { User } from "@features/users/core/entities/User";
import { ULID } from "ulid";

export interface UserDataSource {
  create(user: User): void;
  getById(id: number): Promise<User | null>;
  getByUuid(uuid: ULID): Promise<User | null>;
  getAll(): Promise<User[]>;
  delete(id: string): void;
  update(id: string, data: User): void;
}
