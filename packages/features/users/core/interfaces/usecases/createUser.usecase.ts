import { CreateUserRequest } from "@features/users/application/logic/createUser.usecase";

export default interface createUserUseCase {
  execute(req: CreateUserRequest): Promise<boolean>;
}
