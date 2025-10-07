import { User } from "../../entities/user";

export interface UserRepository {
    create(subject: User): Promise<boolean>;
    list(): Promise<User[]>;
    get(id: number): Promise<User | null>;
    update(subject: User): Promise<User>;
}