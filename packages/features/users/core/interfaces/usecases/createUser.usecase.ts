import { User } from "../../entities/user";

export default interface createUserUseCase {
    execute(subject: User): Promise<boolean>;
}