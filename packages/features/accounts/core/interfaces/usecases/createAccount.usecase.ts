import Account from "../../entities/Account";

export default interface createAccountUseCase {
  execute(subject: Account): Promise<boolean>;
}
