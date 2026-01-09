import createDrizzleClient from "@infrastructure/database/client";
import { AccountDataSource } from "../interfaces/account.datasource";
import Account from "@features/accounts/core/entities/Account";

export type Database = Awaited<ReturnType<typeof createDrizzleClient>>;

// type AccountDAO = typeof characters.$inferInsert;

export class CharacterDataSourceImpl implements AccountDataSource {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async create(newAccount: Account): Promise<void> {
    const data: AccountDAO = {
      pId: ulid(),
      name: newAccount.name,
      userId: userId
    };
    await this.database.insert(characters).values(data);
    return;
  }

  async get(id: number): Promise<Account | null> {
    const data = await this.database
      .select()
      .from(characters)
      .leftJoin(users, eq(characters.userId, users.id))
      .where(eq(characters.id, id)).limit(1);

    const character: Account = new Character(
      data[0].characters.name,
      new InitializedCharacterStatus(),
      new User(data[0].users!.id, data[0].users!.nickname, new InitializedUserStatus, data[0].users!.pId),
      data[0].characters.experience,
      data[0].characters.id,
      data[0].characters.pId
    )
    return character;
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

  async update(id: number, characterData: Account): Promise<boolean> {
    const data = {
      updatedAt: new Date()
    };
    Object.keys(characterData).forEach(item => {
      data.item = characterData[item];

    });
    await this.database.update(characters).set(data).where(eq(characters.id, id));
    return true;
  }

}
