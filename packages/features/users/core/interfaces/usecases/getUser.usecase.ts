import { GetUserRequest } from "@features/users/application/logic/getUser.usecase";
import { User } from "../../entities/User";

export default interface getUserUseCase {
  execute(req: GetUserRequest): Promise<User | null>;
}
