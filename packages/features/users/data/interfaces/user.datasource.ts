import { User } from "@features/users/core/entities/User";

export interface UserDataSource {
    create(user: User): void;
    get(id: number): Promise<User | null>;
    getAll(): Promise<User[]>;
    delete(id: string): void;
    update(id: string, data: User): void;
}
