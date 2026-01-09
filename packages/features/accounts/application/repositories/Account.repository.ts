import Account from "@features/accounts/core/entities/Account";
import { AccountRepository } from "@features/accounts/core/interfaces/repositories/Account.repository";
import { AccountDataSource } from "@features/accounts/data/interfaces/account.datasource";


export default class AccountRepositoryImpl implements AccountRepository {
  dataSource: AccountDataSource

  constructor(characterDataSource: AccountDataSource) {
    this.dataSource = characterDataSource
  }

  async create(subject: Account): Promise<boolean> {
    await this.dataSource.create(subject);
    return true;
  }

  async list(): Promise<Account[]> {
    const data = await this.dataSource.getAll();
    return data;
  }
  async get(id: number): Promise<Account | null> {
    const data = await this.dataSource.get(id);
    return data;
  }
  async update(id: number, subject: Account): Promise<boolean> {
    await this.dataSource.update(id, subject);
    return true;
  }
}
