import Account from "../../entities/Account";

export default interface updateAccountUseCase {
  execute(id: number, subject: Account): Promise<boolean>;
}
