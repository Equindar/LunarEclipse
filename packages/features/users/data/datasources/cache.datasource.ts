
import { User } from "@features/users/core/entities/User";
import { UserDataSource } from "../interfaces/user.datasource";

export default class UserDataSourceImpl implements UserDataSource {
    private readonly cache: User[] = [];

    constructor() { }

    async create(user: User): Promise<boolean> {
        this.cache.push(user);
        return true;
    }


    async get(id: number): Promise<User | null> {
        const result = this.cache.find(item => item.uuid === id.toString());
        return result ?? null;
    }


    async getAll(): Promise<User[]> {
        return this.cache;
    }


    async delete(id: string): Promise<void> {
        const result = this.cache.find(item => item.uuid === id);
        this.cache.pop();
        return
    }


    update(id: string, data: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
