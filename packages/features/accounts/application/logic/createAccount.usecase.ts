import Account from "@features/accounts/core/entities/Account";
import createAccountUseCase from "@features/accounts/core/interfaces/usecases/createAccount.usecase";
import AccountRepository from "../repositories/Account.repository";

export default class createAccount implements createAccountUseCase {
  accountRepository: AccountRepository

  constructor(repository: AccountRepository) {
    this.accountRepository = repository
  }

  execute(subject: Account): Promise<boolean> {
    return this.accountRepository.create(subject);
  }
}
