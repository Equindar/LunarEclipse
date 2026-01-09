import Account from "@features/accounts/core/entities/Account"
import AccountRepository from "../repositories/Account.repository"
import listAccountsUseCase from "@features/accounts/core/interfaces/usecases/listAccounts.usecase"

/**
 * Implementation of the getCharacters UseCase (Location: ApplicationLayer)
 *
 * Path: packages\features\characters\application\logic
 */
export default class listAccounts implements listAccountsUseCase {
  accountRepository: AccountRepository
  constructor(repository: AccountRepository) {
    this.accountRepository = repository
  }

  /**
   * UseCase: listCharacters
   * @returns List of Character Objects
   */
  async execute(): Promise<Account[]> {
    const result = await this.accountRepository.list()
    return result
  }
}
