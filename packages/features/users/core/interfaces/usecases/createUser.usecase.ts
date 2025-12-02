import { User } from "../../entities/User";

export default interface createUserUseCase {
    execute(subject: User): Promise<boolean>;
}
