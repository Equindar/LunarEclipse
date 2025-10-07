import { User } from "@features/users/core/entities/user";

export interface UserDataSource {
    create(character: User): void;
    get(id: number): Promise<User | null>;
    getAll(): Promise<User[]>;
    delete(id: string): void;
    update(id: string, data: User): void;
}