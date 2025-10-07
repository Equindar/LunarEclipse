import { User } from "@features/users/core/entities/user"
import { UserRepository } from "@features/users/core/interfaces/repositories/User.repository"
import { UserDataSource } from "@features/users/data/interfaces/user.datasource"


export default class UserRepositoryImpl implements UserRepository {
    dataSource: UserDataSource

    constructor(characterDataSource: UserDataSource) {
        this.dataSource = characterDataSource
    }
    async create(subject: User): Promise<boolean> {
        await this.dataSource.create(subject);
        return true;
    }
    list(): Promise<User[]> {
        throw new Error("Method not implemented.")
    }
    async get(id: number): Promise<User | null> {
        const data = await this.dataSource.get(id);
        return data;
    }
    update(subject: User): Promise<User> {
        throw new Error("Method not implemented.")
    }
}