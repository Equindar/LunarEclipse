import { eq, asc } from 'drizzle-orm';
import { ULID } from 'ulid';
import { users } from '../../drizzle/migrations/schema';
import createDrizzleClient from '../client';
import { User } from '@lunareclipse/features/src/users/core/entities/User';
import { UserDataSource } from '@lunareclipse/features/src/users/data/interfaces/user.datasource';

type UserDAO = typeof users.$inferInsert;

export type Database = Awaited<ReturnType<typeof createDrizzleClient>>;

export default class UserDataSourceImpl implements UserDataSource {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async create(newUser: User): Promise<boolean> {
    throw new Error('Method not implemented.');
    // const user: UserDAO = {
    //   pId: newUser.uuid,
    //   nickname: newUser.name,
    // };
    // await this.database.insert(users).values(user);
    // return true;
  }

  async getById(id: number): Promise<User | null> {
    throw new Error('Method not implemented.');
    // const data = await this.database
    //   .select({
    //     id: users.id,
    //     uuid: users.pId,
    //     name: users.nickname,
    //   })
    //   .from(users)
    //   .where(eq(users.id, id));
    // return data.length != 0 ? User.get(data[0].id, data[0].uuid, data[0].name, new Date()) : null;
  }

  async getByUuid(uuid: ULID): Promise<User | null> {
    throw new Error('Method not implemented.');
    // const data = await this.database
    //   .select({
    //     id: users.id,
    //     uuid: users.pId,
    //     name: users.nickname,
    //   })
    //   .from(users)
    //   .where(eq(users.pId, uuid));
    // return data.length != 0 ? User.get(data[0].id, data[0].uuid, data[0].name, new Date()) : null;
  }

  async getAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
    // let result = new Array<User>();
    // const data = await this.database
    //   .select({
    //     id: users.id,
    //     uuid: users.pId,
    //     name: users.nickname,
    //   })
    //   .from(users)
    //   .orderBy(asc(users.id));
    // data.forEach((item) => {
    //   result.push(User.get(item.id, item.uuid, item.name, new Date()));
    // });
    // return result;
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
