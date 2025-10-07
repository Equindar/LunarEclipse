import { User } from "../../entities/user";

export default interface getUserUseCase {
    execute(id: number): Promise<User | null>;
}