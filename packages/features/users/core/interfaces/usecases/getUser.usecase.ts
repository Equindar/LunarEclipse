import { User } from "../../entities/User";

export default interface getUserUseCase {
    execute(id: number): Promise<User | null>;
}
