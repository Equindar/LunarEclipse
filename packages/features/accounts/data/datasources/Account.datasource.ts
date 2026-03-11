import createDrizzleClient from "@infrastructure/database/client";
import { AccountDataSource } from "../interfaces/account.datasource";
import Account from "@features/accounts/core/entities/Account";
import { eq, asc } from "drizzle-orm";
import { accounts, users } from "@infrastructure/database/drizzle/migrations/schema";
import { User } from "@features/users/core/entities/User";

export type Database = Awaited<ReturnType<typeof createDrizzleClient>>;

type AccountDAO = typeof accounts.$inferInsert;

export class CharacterDataSourceImpl implements AccountDataSource {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async create(newAccount: Account): Promise<void> {
    const data: AccountDAO = {
      pId: newAccount.uuid
    };
    await this.database.insert(accounts).values(data);
    return;
  }

  async get(id: number): Promise<Account | null> {
    // --- Init
    let owner = null;


    const data = await this.database
      .select()
      .from(accounts)
      .leftJoin(users, eq(accounts.owner, users.id))
      .where(eq(accounts.id, id)).limit(1);

    if (data[0].users) {
      owner = new User(
        data[0].users.pId,
        "Eq",

      )
    }

    const account: Account = new Account(
      'init',
      new User(
        data[0].users?.pId
      ),
      data[0].accounts.owner
    );
    return account;
  }

  async getAll(): Promise<Account[]> {
    let result = new Array<Account>();
    const data = await this.database.select()
      .from(characters)
      .leftJoin(users, eq(characters.userId, users.id))
      .orderBy(asc(users.id));
    data.forEach((item) => {
      result.push(
        new Character(
          item.characters.name,
          new InitializedCharacterStatus,
          new User(data[0].users!.id, data[0].users!.nickname, new InitializedUserStatus, data[0].users!.pId),
          item.characters.experience,
          item.characters.id,
          item.characters.pId)
      );
    });
    return result;
  }

  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async update(id: number, accountData: Account): Promise<boolean> {
    const data = {
      updatedAt: new Date()
    };
    Object.keys(accountData).forEach(item => {
      data.item = accountData[item];

    });
    await this.database.update(account).set(data).where(eq(account.id, id));
    return true;
  }

}
