import Character from "@features/characters/core/entities/Character";
import { CharacterDataSource } from "../interfaces/character.datasource";
import { eq } from "drizzle-orm";
import { characters, users } from "@infrastructure/database/drizzle/migrations/schema";
import { User } from "@features/users/core/entities/User";
import { ulid } from "ulid";
import createDrizzleClient from "@infrastructure/database/client";
import InitializedUserStatus from "@features/users/core/InitializedUserStatus";
import InitializedCharacterStatus from "@features/characters/core/InitializedCharacterStatus";

export type Database = Awaited<ReturnType<typeof createDrizzleClient>>;

type CharacterDAO = typeof characters.$inferInsert;

export class CharacterDataSourceImpl implements CharacterDataSource {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async create(newCharacter: Character, userId: number): Promise<void> {
    const data: CharacterDAO = {
      pId: ulid(),
      name: newCharacter.name,
      userId: userId
    };
    await this.database.insert(characters).values(data);
    return;
  }

  async get(id: number): Promise<Character | null> {
    const data = await this.database
      .select()
      .from(characters)
      .leftJoin(users, eq(characters.userId, users.id))
      .where(eq(characters.id, id)).limit(1);

    const character: Character = new Character(
      data[0].characters.name,
      new InitializedCharacterStatus(),
      new User(data[0].users!.id, data[0].users!.nickname, new InitializedUserStatus, data[0].users!.pId),
      data[0].characters.experience,
      data[0].characters.id,
      data[0].characters.pId
    )
    return character;
  }

  getAll(): Promise<Character[]> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: Character): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
