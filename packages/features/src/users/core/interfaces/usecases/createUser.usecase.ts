

export default interface createUserUseCase {
  execute(req: CreateUserRequest): Promise<boolean>;
}
