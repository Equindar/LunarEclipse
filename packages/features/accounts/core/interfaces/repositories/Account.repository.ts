import Account from "../../entities/Account";

export interface AccountRepository {
  create(subject: Account): Promise<boolean>;
  list(): Promise<Account[]>;
  get(id: number): Promise<Account | null>;
  update(id: number, subject: Account): Promise<boolean>;
}
