import Account from "../../entities/Account";

export default interface getAccountUseCase {
  execute(id: number): Promise<Account | null>;
}
