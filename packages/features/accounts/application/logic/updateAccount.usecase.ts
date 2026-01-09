import Account from "@features/accounts/core/entities/Account";
import updateAccountUseCase from "@features/accounts/core/interfaces/usecases/updateAccount.usecase";
import AccountRepository from "../repositories/Account.repository";

export default class updateAccount implements updateAccountUseCase {
  accountRepository: AccountRepository

  constructor(repository: AccountRepository) {
    this.accountRepository = repository
  }

  async execute(id: number, subject: Account): Promise<boolean> {
    this.accountRepository.update(id, subject);
    return true;
  }
}
