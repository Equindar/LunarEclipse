import Account from "../../entities/Account";

export default interface listAccountsUseCase {
  execute(): Promise<Account[]>;
}
