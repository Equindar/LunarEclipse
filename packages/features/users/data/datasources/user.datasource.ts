
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, asc } from "drizzle-orm";
import { users } from "@infrastructure/database/drizzle/migrations/schema";
import { User } from "@features/users/core/entities/user";
import { UserDataSource } from "../interfaces/user.datasource";
import { monotonicFactory } from "ulid";


type UserDAO = typeof users.$inferInsert;

export default class UserDataSourceImpl implements UserDataSource {
    private database: MySql2Database;


    constructor(database: MySql2Database) {
        this.database = database;
    }

    async create(newUser: User): Promise<boolean> {
        const ulid = monotonicFactory();
        const user: UserDAO = {
            pId: ulid().toString(),
            nickname: newUser.name
        }
        const result = await this.database.insert(users).values(user);
        return true;
    }


    async get(id: number): Promise<User | null> {
        const data = await this.database.select(
            {
                name: users.nickname,
                id: users.id
            }
        ).from(users).where(eq(users.id, id));
        return data.length != 0 ? new User(data[0].name, data[0].id.toString()) : null;
    }


    async getAll(): Promise<User[]> {
        let result = new Array<User>();
        const data = await this.database.select(
            {
                name: users.nickname,
                id: users.id
            }
        ).from(users).orderBy(asc(users.id));
        data.forEach((item) => {
            result.push(new User(item.name, item.id.toString()));
        });
        return result;
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(id: string, data: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

}