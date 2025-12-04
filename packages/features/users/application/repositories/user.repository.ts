import { User } from "@features/users/core/entities/User"
import { UserRepository } from "@features/users/core/interfaces/repositories/User.repository"
import { UserDataSource } from "@features/users/data/interfaces/user.datasource"
import { ULID } from "ulid"


export default class UserRepositoryImpl implements UserRepository {
  dataSource: UserDataSource

  constructor(characterDataSource: UserDataSource) {
    this.dataSource = characterDataSource
  }

  async create(subject: User): Promise<boolean> {
    await this.dataSource.create(subject);
    return true;
  }
  async list(): Promise<User[]> {
    const data = await this.dataSource.getAll();
    return data;
  }
  async getById(id: number): Promise<User | null> {
    const data = await this.dataSource.getById(id);
    return data;
  }
  async getByUuid(uuid: ULID): Promise<User | null> {
    const data = await this.dataSource.getByUuid(uuid);
    return data;
  }
  update(subject: User): Promise<User> {
    throw new Error("Method not implemented.")
  }
}
