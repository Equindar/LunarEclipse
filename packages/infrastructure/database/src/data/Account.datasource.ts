import Account from "@lunareclipse/features/src/accounts/core/entities/Account";
import Character from "@lunareclipse/features/src/characters/core/entities/Character";
import InitializedCharacterStatus from "@lunareclipse/features/src/characters/core/InitializedCharacterStatus";
import { User } from "@lunareclipse/features/src/users/core/entities/User";
import InitializedUserStatus from "@lunareclipse/features/src/users/core/InitializedUserStatus";
import { asc, eq } from "drizzle-orm";
import { accounts, characters, users } from "../../drizzle/migrations/schema";
import createDrizzleClient from "../client";
import { AccountDataSource } from "./interfaces/account.datasource";


export type Database = Awaited<ReturnType<typeof createDrizzleClient>>;

type AccountDAO = typeof accounts.$inferInsert;

export class CharacterDataSourceImpl implements AccountDataSource {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async create(newAccount: Account): Promise<void> {
    const data: AccountDAO = {
      pId: newAccount.uuid,
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
      .where(eq(accounts.id, id))
      .limit(1);

    if (data[0].users) {
      owner = new User(data[0].users.pId, 'Eq');
    }

    const account: Account = new Account(
      'init',
      new User(data[0].users?.pId),
      data[0].accounts.owner,
    );
    return account;
  }

  async getAll(): Promise<Account[]> {
    throw new Error('Method not implemented.');
    // let result = new Array<Account>();
    // const data = await this.database
    //   .select()
    //   .from(characters)
    //   .leftJoin(users, eq(characters.userId, users.id))
    //   .orderBy(asc(users.id));
    // data.forEach((item) => {
    //   result.push(
    //     new Character(
    //       item.characters.name,
    //       new InitializedCharacterStatus(),
    //       new User(
    //         data[0].users!.id,
    //         data[0].users!.nickname,
    //         new InitializedUserStatus(),
    //         data[0].users!.pId,
    //       ),
    //       item.characters.experience,
    //       item.characters.id,
    //       item.characters.pId,
    //     ),
    //   );
    // });
    // return result;
  }

  async delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async update(id: number, accountData: Account): Promise<boolean> {
    throw new Error('Method not implemented.');
    // const data = {
    //   updatedAt: new Date(),
    // };
    // Object.keys(accountData).forEach((item) => {
    //   data.item = accountData[item];
    // });
    // await this.database.update(account).set(data).where(eq(account.id, id));
    // return true;
  }
}
