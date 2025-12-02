import { User } from "../../entities/User";

export default interface listUsersUseCase {
    execute(): Promise<User[]>;
}
