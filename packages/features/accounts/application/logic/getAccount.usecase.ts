import Account from "@features/accounts/core/entities/Account";
import getAccountUseCase from "@features/accounts/core/interfaces/usecases/getAccount.usecase";
import AccountRepository from "../repositories/Account.repository";

/**
 * Implementation of the getCharacter UseCase (Location: ApplicationLayer)
 *
 * Path: packages\features\characters\application\logic
 */
export default class getAccount implements getAccountUseCase {
  accountRepository: AccountRepository
  constructor(repository: AccountRepository) {
    this.accountRepository = repository
  }

  /**
   * UseCase: getCharacter by ID
   * @param id ID of the Character
   * @returns Character Object
   */
  async execute(id: number): Promise<Account | null> {
    const result = await this.accountRepository.get(id);
    return result;
  }
}
