
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { users } from "@infrastructure/database/drizzle/migrations/schema";
import { User } from "@features/users/core/entities/user";
import { UserDataSource } from "../interfaces/user.datasource";

export default class UserDataSourceImpl implements UserDataSource {
    private database: MySql2Database;

    constructor(database: MySql2Database) {
        this.database = database;
    }

    async create(user: User): Promise<boolean> {
        const result = await this.database.insert(users).values(
            {
                nickname: user.name
            }
        );
        return result !== null;
    }


    async get(id: number): Promise<User | null> {
        const data = await this.database.select(
            {
                name: users.nickname,
                id: users.id
            }
        ).from(users).where(eq(users.id, id));
        return new User(data[0].name, data[0].id.toString());
    }


    getAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(id: string, data: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

}