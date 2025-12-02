
import { eq, asc } from "drizzle-orm";
import { users } from "@infrastructure/database/drizzle/migrations/schema";
import { User } from "@features/users/core/entities/User";
import { UserDataSource } from "../interfaces/user.datasource";
import { ulid } from "ulid";
import createDrizzleClient from "@infrastructure/database/client";
import InitializedUserStatus from "@features/users/core/InitializedUserStatus";

type UserDAO = typeof users.$inferInsert;

export type Database = Awaited<ReturnType<typeof createDrizzleClient>>;

export default class UserDataSourceImpl implements UserDataSource {
  private database: Database;


  constructor(database: Database) {
    this.database = database;
  }

  async create(newUser: User): Promise<boolean> {
    const user: UserDAO = {
      pId: ulid(),
      nickname: newUser.name
    }
    const result = await this.database.insert(users).values(user);
    return true;
  }


  async get(id: number): Promise<User | null> {
    const data = await this.database.select(
      {
        id: users.id,
        uuid: users.pId,
        name: users.nickname,
      }
    ).from(users).where(eq(users.id, id));
    return data.length != 0 ? new User(data[0].id, data[0].name, new InitializedUserStatus, data[0].uuid) : null;
  }


  async getAll(): Promise<User[]> {
    let result = new Array<User>();
    const data = await this.database.select(
      {
        id: users.id,
        uuid: users.pId,
        name: users.nickname
      }
    ).from(users).orderBy(asc(users.id));
    data.forEach((item) => {
      result.push(new User(item.id, item.name, new InitializedUserStatus, item.uuid));
    });
    return result;
  }


  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }


  async update(id: string, data: User): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
