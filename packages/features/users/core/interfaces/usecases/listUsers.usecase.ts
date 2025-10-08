import { User } from "../../entities/user";

export default interface listUsersUseCase {
    execute(): Promise<User[]>;
}