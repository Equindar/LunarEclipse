import Account from "@features/accounts/core/entities/Account";

export interface AccountDataSource {
  create(account: Account): void;
  get(id: number): Promise<Account | null>;
  getAll(): Promise<Account[]>;
  delete(id: number): void;
  update(id: number, data: Account): void;
}
